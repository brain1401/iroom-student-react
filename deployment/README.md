# iRoom Student React - Production Deployment Guide

This guide will help you deploy the iRoom Student React application to `student.iroomclass.com` using nginx and acme.sh for SSL certificate management.

## 🚀 Quick Start

For a complete automated deployment, run:

```bash
sudo chmod +x deployment/deploy.sh
sudo ./deployment/deploy.sh
```

## 📋 Prerequisites

- Ubuntu/Debian server with root access
- Domain `student.iroomclass.com` pointing to your server's IP address
- Ports 80 and 443 open (for HTTP and HTTPS)
- At least 2GB RAM and 1GB free disk space

## 📁 Deployment Files Structure

```
deployment/
├── deploy.sh              # Main deployment script
├── ssl-setup.sh           # SSL certificate management
├── README.md              # This file
├── nginx/
│   └── student.iroomclass.com.conf  # Nginx virtual host config
└── systemd/
    └── iroom-student.service       # Systemd service file
```

## 🔧 Manual Deployment Steps

If you prefer to deploy manually or understand each step:

### 1. Prepare the Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install basic dependencies
sudo apt install -y nginx git curl wget ufw

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Create Application User

```bash
sudo useradd --system --create-home --shell /bin/bash iroomstudent
```

### 3. Clone and Build Application

```bash
# Clone repository
sudo git clone https://github.com/brain1401/iroom-student-react.git /opt/iroom-student-react

# Change ownership
sudo chown -R iroomstudent:iroomstudent /opt/iroom-student-react

# Build application
cd /opt/iroom-student-react
sudo -u iroomstudent npm ci --production=false
sudo -u iroomstudent npm run build
```

### 4. Setup Systemd Service

```bash
# Copy service file
sudo cp deployment/systemd/iroom-student.service /etc/systemd/system/

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable iroom-student.service
sudo systemctl start iroom-student.service
```

### 5. Configure Nginx

```bash
# Copy nginx configuration
sudo cp deployment/nginx/student.iroomclass.com.conf /etc/nginx/sites-available/

# Enable site
sudo ln -s /etc/nginx/sites-available/student.iroomclass.com.conf /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start nginx
sudo systemctl restart nginx
```

### 6. Setup SSL with acme.sh

```bash
# Make SSL setup script executable
sudo chmod +x deployment/ssl-setup.sh

# Install SSL certificates
sudo ./deployment/ssl-setup.sh install
```

### 7. Configure Firewall

```bash
# Reset UFW and set defaults
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary services
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw --force enable
```

## 🛠️ Management Commands

### Application Management

```bash
# Check application status
sudo systemctl status iroom-student

# View application logs
sudo journalctl -u iroom-student -f

# Restart application
sudo systemctl restart iroom-student

# Update application
sudo ./deployment/deploy.sh --app-only
```

### SSL Certificate Management

```bash
# Check certificate status
sudo ./deployment/ssl-setup.sh status

# Renew certificate manually
sudo ./deployment/ssl-setup.sh renew

# Test SSL configuration
sudo ./deployment/ssl-setup.sh test
```

### Nginx Management

```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check service status
sudo systemctl status iroom-student

# Check logs
sudo journalctl -u iroom-student -n 50

# Common fixes:
sudo chown -R iroomstudent:iroomstudent /opt/iroom-student-react
cd /opt/iroom-student-react && sudo -u iroomstudent npm run build
```

#### 2. SSL Certificate Issues

```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify DNS is pointing to server
nslookup student.iroomclass.com

# Re-issue certificate
sudo ./deployment/ssl-setup.sh remove
sudo ./deployment/ssl-setup.sh install
```

#### 3. Nginx Configuration Issues

```bash
# Test configuration
sudo nginx -t

# Check syntax errors in config file
sudo nano /etc/nginx/sites-available/student.iroomclass.com.conf

# Restart nginx
sudo systemctl restart nginx
```

#### 4. Port 3000 Already in Use

```bash
# Check what's using port 3000
sudo netstat -tulpn | grep :3000

# Stop conflicting services
sudo systemctl stop <conflicting-service>
```

### Health Checks

```bash
# Check if app responds locally
curl -f http://localhost:3000

# Check HTTPS response
curl -f https://student.iroomclass.com

# Check SSL certificate expiration
echo | openssl s_client -servername student.iroomclass.com -connect student.iroomclass.com:443 2>/dev/null | openssl x509 -noout -dates
```

## 🔐 Security Features

The deployment includes several security features:

- **SSL/TLS**: HTTPS-only with automatic certificate renewal
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **Rate Limiting**: 10 requests/second per IP
- **Firewall**: UFW configured with minimal open ports
- **System User**: Application runs as dedicated non-root user
- **Systemd Security**: Various systemd security settings applied

## 📊 Monitoring

### Log Locations

- **Application Logs**: `journalctl -u iroom-student`
- **Nginx Access**: `/var/log/nginx/access.log`
- **Nginx Error**: `/var/log/nginx/error.log`
- **System**: `journalctl -f`

### Performance Monitoring

```bash
# Check resource usage
htop

# Monitor nginx status
sudo nginx -s reload && curl -s http://localhost/nginx_status

# Check disk usage
df -h
```

## 🔄 Updates and Maintenance

### Application Updates

```bash
# Update application code only
sudo ./deployment/deploy.sh --app-only
```

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### SSL Certificate Renewal

Certificates are automatically renewed via cron. Manual renewal:

```bash
sudo ./deployment/ssl-setup.sh renew
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs for error messages
3. Ensure DNS is properly configured
4. Verify firewall settings
5. Check system resources (disk space, memory)

## 🌟 Post-Deployment Checklist

After successful deployment, verify:

- [ ] Application is accessible at https://student.iroomclass.com
- [ ] SSL certificate is valid and trusted
- [ ] All HTTP requests redirect to HTTPS
- [ ] Application logs show no errors
- [ ] Firewall is properly configured
- [ ] Auto-renewal for SSL certificates is set up
- [ ] Systemd service starts automatically on reboot

## 📈 Performance Optimization

The nginx configuration includes:

- **Gzip compression** for text-based assets
- **Browser caching** for static assets
- **HTTP/2** support for faster loading
- **Connection keep-alive** for reduced latency
- **Rate limiting** to prevent abuse

Enjoy your deployment! 🚀