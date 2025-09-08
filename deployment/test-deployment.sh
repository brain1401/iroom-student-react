#!/bin/bash

# Deployment Test Script for iRoom Student React
# Usage: ./test-deployment.sh

set -e

# Configuration
DOMAIN="student.iroomclass.com"
APP_NAME="iroom-student"
APP_PORT="3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
}

test_service_status() {
    log_info "Testing systemd service status..."
    
    if systemctl is-active --quiet "$APP_NAME"; then
        log_success "Application service is running"
    else
        log_error "Application service is not running"
        systemctl status "$APP_NAME" --no-pager
        return 1
    fi
    
    if systemctl is-enabled --quiet "$APP_NAME"; then
        log_success "Application service is enabled for startup"
    else
        log_error "Application service is not enabled for startup"
        return 1
    fi
}

test_nginx_status() {
    log_info "Testing nginx status..."
    
    if systemctl is-active --quiet nginx; then
        log_success "Nginx is running"
    else
        log_error "Nginx is not running"
        return 1
    fi
    
    if nginx -t 2>/dev/null; then
        log_success "Nginx configuration is valid"
    else
        log_error "Nginx configuration has errors"
        nginx -t
        return 1
    fi
}

test_local_app_response() {
    log_info "Testing local application response..."
    
    if curl -f -s "http://localhost:$APP_PORT" >/dev/null; then
        log_success "Application responds on localhost:$APP_PORT"
    else
        log_error "Application does not respond on localhost:$APP_PORT"
        return 1
    fi
    
    # Test if it returns HTML content
    if curl -s "http://localhost:$APP_PORT" | grep -q "<html\|<!DOCTYPE"; then
        log_success "Application returns HTML content"
    else
        log_error "Application does not return valid HTML content"
        return 1
    fi
}

test_http_redirect() {
    log_info "Testing HTTP to HTTPS redirect..."
    
    # Test local redirect
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost" -H "Host: $DOMAIN")
    if [ "$status_code" = "301" ]; then
        log_success "HTTP redirects to HTTPS (status: $status_code)"
    else
        log_error "HTTP does not redirect properly (status: $status_code)"
        return 1
    fi
}

test_ssl_certificate() {
    log_info "Testing SSL certificate..."
    
    local ssl_dir="/etc/nginx/ssl/$DOMAIN"
    
    if [ -f "$ssl_dir/fullchain.pem" ] && [ -f "$ssl_dir/key.pem" ]; then
        log_success "SSL certificate files exist"
        
        # Check certificate validity
        if openssl x509 -in "$ssl_dir/fullchain.pem" -noout -checkend 86400; then
            log_success "SSL certificate is valid and not expiring within 24 hours"
        else
            log_error "SSL certificate is expired or expiring soon"
            return 1
        fi
        
        # Check certificate subject
        local subject=$(openssl x509 -in "$ssl_dir/fullchain.pem" -noout -subject)
        if echo "$subject" | grep -q "$DOMAIN"; then
            log_success "SSL certificate is for correct domain"
        else
            log_error "SSL certificate is not for $DOMAIN"
            echo "Certificate subject: $subject"
            return 1
        fi
    else
        log_error "SSL certificate files not found"
        return 1
    fi
}

test_https_response() {
    log_info "Testing HTTPS response..."
    
    # Test local HTTPS
    if curl -f -s -k "https://localhost" -H "Host: $DOMAIN" >/dev/null; then
        log_success "Local HTTPS responds correctly"
    else
        log_error "Local HTTPS does not respond"
        return 1
    fi
    
    # Test external HTTPS (if DNS is configured)
    if curl -f -s --connect-timeout 10 "https://$DOMAIN" >/dev/null 2>&1; then
        log_success "External HTTPS responds correctly"
        
        # Test SSL grade
        local ssl_info=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -issuer)
        if echo "$ssl_info" | grep -q "Let's Encrypt\|ZeroSSL"; then
            log_success "SSL certificate is from a trusted CA"
        else
            log_warning "SSL certificate issuer: $ssl_info"
        fi
    else
        log_warning "External HTTPS test failed - DNS may not be configured yet"
    fi
}

test_security_headers() {
    log_info "Testing security headers..."
    
    # Test HSTS header
    if curl -s -I "https://localhost" -H "Host: $DOMAIN" -k | grep -q "Strict-Transport-Security"; then
        log_success "HSTS header is present"
    else
        log_error "HSTS header is missing"
    fi
    
    # Test X-Content-Type-Options header
    if curl -s -I "https://localhost" -H "Host: $DOMAIN" -k | grep -q "X-Content-Type-Options"; then
        log_success "X-Content-Type-Options header is present"
    else
        log_error "X-Content-Type-Options header is missing"
    fi
    
    # Test X-Frame-Options header
    if curl -s -I "https://localhost" -H "Host: $DOMAIN" -k | grep -q "X-Frame-Options"; then
        log_success "X-Frame-Options header is present"
    else
        log_error "X-Frame-Options header is missing"
    fi
}

test_firewall_status() {
    log_info "Testing firewall configuration..."
    
    if ufw status | grep -q "Status: active"; then
        log_success "UFW firewall is active"
        
        if ufw status | grep -q "80/tcp.*ALLOW"; then
            log_success "HTTP port (80) is open"
        else
            log_error "HTTP port (80) is not open"
        fi
        
        if ufw status | grep -q "443/tcp.*ALLOW"; then
            log_success "HTTPS port (443) is open"
        else
            log_error "HTTPS port (443) is not open"
        fi
    else
        log_error "UFW firewall is not active"
    fi
}

test_acme_cron() {
    log_info "Testing acme.sh auto-renewal..."
    
    if crontab -l 2>/dev/null | grep -q "acme.sh.*--cron"; then
        log_success "acme.sh cron job is configured"
    else
        log_error "acme.sh cron job is not configured"
    fi
    
    if [ -f "/root/.acme.sh/acme.sh" ]; then
        log_success "acme.sh is installed"
        
        # Check if domain is in acme.sh list
        if /root/.acme.sh/acme.sh --list | grep -q "$DOMAIN"; then
            log_success "Domain is configured for auto-renewal"
        else
            log_error "Domain is not configured for auto-renewal"
        fi
    else
        log_error "acme.sh is not installed"
    fi
}

test_performance() {
    log_info "Testing basic performance..."
    
    # Test response time
    local response_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:$APP_PORT")
    if (( $(echo "$response_time < 2.0" | bc -l) )); then
        log_success "Response time is acceptable ($response_time seconds)"
    else
        log_warning "Response time is slow ($response_time seconds)"
    fi
    
    # Test gzip compression
    if curl -s -H "Accept-Encoding: gzip" "http://localhost:$APP_PORT" -I | grep -q "Content-Encoding: gzip"; then
        log_success "Gzip compression is working"
    else
        log_warning "Gzip compression is not working"
    fi
}

test_logs() {
    log_info "Testing log accessibility..."
    
    # Check if logs are being generated
    local log_lines=$(journalctl -u "$APP_NAME" --since "1 hour ago" | wc -l)
    if [ "$log_lines" -gt 0 ]; then
        log_success "Application logs are being generated ($log_lines lines in last hour)"
    else
        log_warning "No recent application logs found"
    fi
    
    # Check for errors in recent logs
    local error_count=$(journalctl -u "$APP_NAME" --since "1 hour ago" -p err | wc -l)
    if [ "$error_count" -eq 0 ]; then
        log_success "No errors in recent application logs"
    else
        log_warning "Found $error_count errors in recent application logs"
    fi
}

run_all_tests() {
    log_info "Starting deployment tests for $DOMAIN..."
    echo
    
    # Run all tests
    test_service_status || true
    test_nginx_status || true
    test_local_app_response || true
    test_http_redirect || true
    test_ssl_certificate || true
    test_https_response || true
    test_security_headers || true
    test_firewall_status || true
    test_acme_cron || true
    test_performance || true
    test_logs || true
    
    echo
    log_info "Test Results Summary:"
    echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo
        log_success "🎉 All tests passed! Deployment is successful!"
        echo
        echo "Your application is ready at: https://$DOMAIN"
        echo
        return 0
    else
        echo
        log_error "❌ Some tests failed. Please check the issues above."
        echo
        return 1
    fi
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo "Note: Some tests require root privileges. Run with sudo for complete testing."
    echo
fi

# Run tests
run_all_tests