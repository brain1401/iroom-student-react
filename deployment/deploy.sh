#!/bin/bash

# iRoom Student React Deployment Script
# Usage: ./deploy.sh [--initial] [--ssl-only] [--app-only]

set -e  # Exit on any error

# Configuration
APP_NAME="iroom-student"
APP_USER="iroomstudent"
APP_GROUP="iroomstudent"
APP_DIR="/opt/iroom-student-react"
DOMAIN="student.iroomclass.com"
REPO_URL="https://github.com/brain1401/iroom-student-react.git"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
SSL_DIR="/etc/nginx/ssl/${DOMAIN}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

# Create system user
create_user() {
    if ! id "$APP_USER" &>/dev/null; then
        log_info "Creating system user: $APP_USER"
        useradd --system --create-home --shell /bin/bash --group-name "$APP_GROUP" "$APP_USER"
        log_success "Created user: $APP_USER"
    else
        log_info "User $APP_USER already exists"
    fi
}

# Install system dependencies
install_dependencies() {
    log_info "Installing system dependencies..."
    apt-get update
    apt-get install -y nginx git curl wget sudo ufw
    
    # Install Node.js (using NodeSource repository)
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    log_success "System dependencies installed"
}

# Setup application directory
setup_app_directory() {
    log_info "Setting up application directory..."
    
    if [ -d "$APP_DIR" ]; then
        log_warning "Application directory exists. Backing up..."
        mv "$APP_DIR" "${APP_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Clone repository
    log_info "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    
    # Change ownership
    chown -R "$APP_USER:$APP_GROUP" "$APP_DIR"
    
    log_success "Application directory setup complete"
}

# Build application
build_app() {
    log_info "Building application..."
    
    cd "$APP_DIR"
    
    # Install dependencies and build as app user
    sudo -u "$APP_USER" npm ci --production=false
    sudo -u "$APP_USER" npm run build
    
    # Create necessary directories
    mkdir -p logs
    chown -R "$APP_USER:$APP_GROUP" "$APP_DIR"
    
    log_success "Application built successfully"
}

# Setup systemd service
setup_service() {
    log_info "Setting up systemd service..."
    
    # Copy service file
    cp "$(dirname "$0")/systemd/${APP_NAME}.service" "$SERVICE_FILE"
    
    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable "$SERVICE_FILE"
    
    log_success "Systemd service configured"
}

# Setup nginx
setup_nginx() {
    log_info "Setting up nginx configuration..."
    
    # Create SSL directory
    mkdir -p "$SSL_DIR"
    
    # Copy nginx configuration
    cp "$(dirname "$0")/nginx/${DOMAIN}.conf" "$NGINX_CONF"
    
    # Create symlink to sites-enabled
    if [ ! -L "/etc/nginx/sites-enabled/${DOMAIN}" ]; then
        ln -s "$NGINX_CONF" "/etc/nginx/sites-enabled/"
    fi
    
    # Remove default nginx site
    if [ -L "/etc/nginx/sites-enabled/default" ]; then
        rm "/etc/nginx/sites-enabled/default"
    fi
    
    # Test nginx configuration
    nginx -t
    
    log_success "Nginx configured"
}

# Install and configure acme.sh
setup_acme() {
    log_info "Installing and configuring acme.sh..."
    
    # Install acme.sh if not already installed
    if [ ! -d "/root/.acme.sh" ]; then
        curl https://get.acme.sh | sh -s email=admin@iroomclass.com
        source /root/.bashrc
    fi
    
    # Restart nginx to ensure it's running
    systemctl restart nginx
    
    # Issue certificate using nginx plugin
    /root/.acme.sh/acme.sh --issue --nginx -d "$DOMAIN" --force
    
    # Install certificate
    /root/.acme.sh/acme.sh --install-cert -d "$DOMAIN" \
        --key-file "${SSL_DIR}/key.pem" \
        --fullchain-file "${SSL_DIR}/fullchain.pem" \
        --reloadcmd "systemctl reload nginx"
    
    log_success "SSL certificates installed"
}

# Setup firewall
setup_firewall() {
    log_info "Configuring firewall..."
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH, HTTP, and HTTPS
    ufw allow ssh
    ufw allow http
    ufw allow https
    
    # Enable firewall
    ufw --force enable
    
    log_success "Firewall configured"
}

# Start services
start_services() {
    log_info "Starting services..."
    
    # Start application service
    systemctl start "$APP_NAME"
    
    # Reload nginx
    systemctl reload nginx
    
    # Check service status
    if systemctl is-active --quiet "$APP_NAME"; then
        log_success "Application service is running"
    else
        log_error "Failed to start application service"
        systemctl status "$APP_NAME"
        exit 1
    fi
    
    if systemctl is-active --quiet nginx; then
        log_success "Nginx is running"
    else
        log_error "Nginx is not running"
        systemctl status nginx
        exit 1
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait a moment for services to fully start
    sleep 5
    
    # Check if app responds on localhost
    if curl -f -s http://localhost:3000 >/dev/null; then
        log_success "Application is responding on localhost:3000"
    else
        log_error "Application is not responding on localhost:3000"
        exit 1
    fi
    
    # Check HTTPS (if SSL is configured)
    if [ -f "${SSL_DIR}/fullchain.pem" ]; then
        if curl -f -s "https://${DOMAIN}" >/dev/null; then
            log_success "HTTPS is working for ${DOMAIN}"
        else
            log_warning "HTTPS check failed - this is normal if DNS is not yet configured"
        fi
    fi
}

# Display final information
show_completion_info() {
    log_success "Deployment completed successfully!"
    echo
    echo "=== Deployment Summary ==="
    echo "Domain: $DOMAIN"
    echo "Application: $APP_DIR"
    echo "Service: $APP_NAME"
    echo "User: $APP_USER"
    echo
    echo "=== Next Steps ==="
    echo "1. Configure your DNS to point $DOMAIN to this server's IP"
    echo "2. Test the application: https://$DOMAIN"
    echo "3. Monitor logs: journalctl -u $APP_NAME -f"
    echo
    echo "=== Useful Commands ==="
    echo "Restart app:    systemctl restart $APP_NAME"
    echo "Check status:   systemctl status $APP_NAME"
    echo "View logs:      journalctl -u $APP_NAME -f"
    echo "Reload nginx:   systemctl reload nginx"
    echo "Renew SSL:      /root/.acme.sh/acme.sh --renew -d $DOMAIN --force"
}

# Main deployment function
deploy() {
    log_info "Starting deployment of iRoom Student React application"
    
    check_root
    create_user
    install_dependencies
    setup_app_directory
    build_app
    setup_service
    setup_nginx
    
    if [[ "$1" != "--no-ssl" ]]; then
        setup_acme
    fi
    
    setup_firewall
    start_services
    health_check
    show_completion_info
}

# Parse command line arguments
case "${1:-}" in
    --ssl-only)
        log_info "SSL-only mode"
        check_root
        setup_acme
        systemctl reload nginx
        ;;
    --app-only)
        log_info "App-only mode"
        check_root
        cd "$APP_DIR"
        systemctl stop "$APP_NAME"
        sudo -u "$APP_USER" git pull
        sudo -u "$APP_USER" npm ci --production=false
        sudo -u "$APP_USER" npm run build
        systemctl start "$APP_NAME"
        log_success "Application updated and restarted"
        ;;
    --initial|"")
        deploy "$@"
        ;;
    *)
        echo "Usage: $0 [--initial] [--ssl-only] [--app-only]"
        echo "  --initial   : Full deployment (default)"
        echo "  --ssl-only  : Only setup SSL certificates"
        echo "  --app-only  : Only update and restart application"
        exit 1
        ;;
esac