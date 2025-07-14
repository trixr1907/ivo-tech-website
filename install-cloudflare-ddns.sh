#!/bin/bash

# Installation script for Cloudflare DDNS in Alpine LXC
# Run this script as root in your Alpine LXC container

set -e

echo "Installing Cloudflare Dynamic DNS Updater..."

# Update package manager and install dependencies
apk update
apk add python3 py3-pip curl

# Install required Python packages
pip3 install requests

# Create directory for the script
mkdir -p /usr/local/bin

# Copy the Python script
cp cloudflare-ddns.py /usr/local/bin/
chmod +x /usr/local/bin/cloudflare-ddns.py

# Create log directory
mkdir -p /var/log
touch /var/log/cloudflare-ddns.log

# Copy systemd service and timer files
cp cloudflare-ddns.service /etc/systemd/system/
cp cloudflare-ddns.timer /etc/systemd/system/

# Set proper permissions
chmod 644 /etc/systemd/system/cloudflare-ddns.service
chmod 644 /etc/systemd/system/cloudflare-ddns.timer

# Reload systemd
systemctl daemon-reload

echo "Installation complete!"
echo ""
echo "IMPORTANT: You need to edit the service file with your Cloudflare credentials:"
echo "1. Edit /etc/systemd/system/cloudflare-ddns.service"
echo "2. Replace 'your_zone_id_here' with your actual Cloudflare Zone ID"
echo "3. Replace 'your_dns_record_id_here' with your actual DNS record ID"
echo "4. Replace 'your_cloudflare_token_here' with your actual Cloudflare API token"
echo ""
echo "Then run:"
echo "systemctl enable cloudflare-ddns.timer"
echo "systemctl start cloudflare-ddns.timer"
echo ""
echo "To check status:"
echo "systemctl status cloudflare-ddns.timer"
echo "journalctl -u cloudflare-ddns.service -f"
echo ""
echo "To view logs:"
echo "tail -f /var/log/cloudflare-ddns.log"
