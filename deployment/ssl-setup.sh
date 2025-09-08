#!/bin/bash

# SSL Certificate Management Script for iRoom Student React
# Usage: ./ssl-setup.sh [install|renew|status|remove]

set -e

# Configuration
DOMAIN="student.iroomclass.com"
SSL_DIR="/etc/nginx/ssl/${DOMAIN}"
ACME_HOME="/root/.acme.sh"
ADMIN_EMAIL="admin@iroomclass.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

install_acme() {
    log_info "Installing acme.sh..."
    
    if [ -d "$ACME_HOME" ]; then
        log_info "acme.sh already installed, upgrading..."
        "$ACME_HOME/acme.sh" --upgrade
    else
        curl https://get.acme.sh | sh -s email="$ADMIN_EMAIL"
        log_success "acme.sh installed"
    fi
    
    # Reload bash environment
    source ~/.bashrc
}

setup_directories() {
    log_info "Setting up SSL directories..."
    mkdir -p "$SSL_DIR"
    mkdir -p /var/www/html/.well-known/acme-challenge
    chown -R www-data:www-data /var/www/html/.well-known
    log_success "SSL directories created"
}

issue_certificate() {
    log_info "Issuing SSL certificate for $DOMAIN..."
    
    # Ensure nginx is running
    if ! systemctl is-active --quiet nginx; then
        log_error "Nginx is not running. Please start nginx first."
        exit 1
    fi
    
    # Issue certificate using nginx plugin
    "$ACME_HOME/acme.sh" --issue --nginx -d "$DOMAIN" --force
    
    if [ $? -eq 0 ]; then
        log_success "Certificate issued successfully"
    else
        log_error "Failed to issue certificate"
        exit 1
    fi
}

install_certificate() {
    log_info "Installing SSL certificate..."
    
    "$ACME_HOME/acme.sh" --install-cert -d "$DOMAIN" \
        --key-file "${SSL_DIR}/key.pem" \
        --fullchain-file "${SSL_DIR}/fullchain.pem" \
        --reloadcmd "systemctl reload nginx"
    
    if [ $? -eq 0 ]; then
        log_success "Certificate installed successfully"
        
        # Set proper permissions
        chmod 600 "${SSL_DIR}/key.pem"
        chmod 644 "${SSL_DIR}/fullchain.pem"
        chown root:root "${SSL_DIR}/"*.pem
        
        # Reload nginx
        systemctl reload nginx
        log_success "Nginx reloaded with new certificates"
    else
        log_error "Failed to install certificate"
        exit 1
    fi
}

renew_certificate() {
    log_info "Renewing SSL certificate for $DOMAIN..."
    
    "$ACME_HOME/acme.sh" --renew -d "$DOMAIN" --force
    
    if [ $? -eq 0 ]; then
        log_success "Certificate renewed successfully"
        systemctl reload nginx
    else
        log_error "Failed to renew certificate"
        exit 1
    fi
}

show_certificate_status() {
    log_info "Certificate status for $DOMAIN:"
    
    if [ -f "${SSL_DIR}/fullchain.pem" ]; then
        echo "Certificate file: ${SSL_DIR}/fullchain.pem"
        echo "Key file: ${SSL_DIR}/key.pem"
        echo
        echo "Certificate details:"
        openssl x509 -in "${SSL_DIR}/fullchain.pem" -text -noout | grep -E "(Subject:|Issuer:|Not Before|Not After)"
        echo
        echo "Days until expiration:"
        openssl x509 -in "${SSL_DIR}/fullchain.pem" -noout -dates | grep "notAfter" | cut -d= -f2 | xargs -I {} date -d "{}" +%s | xargs -I {} echo "scale=2; ({} - $(date +%s)) / 86400" | bc
    else
        log_warning "No certificate found for $DOMAIN"
    fi
    
    echo
    echo "Acme.sh certificate list:"
    if [ -f "$ACME_HOME/acme.sh" ]; then
        "$ACME_HOME/acme.sh" --list
    else
        log_warning "acme.sh not installed"
    fi
}

remove_certificate() {
    log_warning "Removing SSL certificate for $DOMAIN..."
    read -p "Are you sure? This will remove the certificate from acme.sh renewal list. [y/N]: " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove from acme.sh
        if [ -f "$ACME_HOME/acme.sh" ]; then
            "$ACME_HOME/acme.sh" --remove -d "$DOMAIN"
        fi
        
        # Remove certificate files
        if [ -d "$SSL_DIR" ]; then
            rm -rf "$SSL_DIR"
            log_success "Certificate files removed"
        fi
        
        log_success "Certificate removed from renewal list"
    else
        log_info "Operation cancelled"
    fi
}

setup_auto_renewal() {
    log_info "Setting up automatic certificate renewal..."
    
    # Check if cron entry already exists
    if crontab -l 2>/dev/null | grep -q "acme.sh --cron"; then
        log_info "Cron entry already exists"
    else
        # Add cron entry
        (crontab -l 2>/dev/null; echo "0 2 * * * \"$ACME_HOME/acme.sh\" --cron --home \"$ACME_HOME\" > /dev/null") | crontab -
        log_success "Auto-renewal cron job added"
    fi
    
    # Enable auto-upgrade
    "$ACME_HOME/acme.sh" --upgrade --auto-upgrade
    log_success "Auto-upgrade enabled"
}

test_ssl() {
    log_info "Testing SSL certificate..."
    
    # Test local connection
    if curl -f -s -I "https://localhost" -H "Host: $DOMAIN" --insecure >/dev/null; then
        log_success "Local SSL test passed"
    else
        log_warning "Local SSL test failed"
    fi
    
    # Test external connection (if DNS is configured)
    if curl -f -s -I "https://$DOMAIN" >/dev/null; then
        log_success "External SSL test passed"
        
        # Check SSL certificate with openssl
        echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates
    else
        log_warning "External SSL test failed - ensure DNS is configured"
    fi
}

case "${1:-install}" in
    install)
        log_info "Full SSL certificate installation"
        check_root
        install_acme
        setup_directories
        issue_certificate
        install_certificate
        setup_auto_renewal
        test_ssl
        ;;
    renew)
        log_info "Certificate renewal"
        check_root
        renew_certificate
        test_ssl
        ;;
    status)
        check_root
        show_certificate_status
        ;;
    remove)
        check_root
        remove_certificate
        ;;
    test)
        check_root
        test_ssl
        ;;
    *)
        echo "Usage: $0 [install|renew|status|remove|test]"
        echo "  install : Install acme.sh and issue certificate (default)"
        echo "  renew   : Renew existing certificate"
        echo "  status  : Show certificate status and details"
        echo "  remove  : Remove certificate and cleanup"
        echo "  test    : Test SSL certificate"
        exit 1
        ;;
esac