#!/usr/bin/env python3
import os
import requests
import subprocess
import sys
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/cloudflare-ddns.log'),
        logging.StreamHandler()
    ]
)

def get_current_ip():
    """Get current WAN IP address using Cloudflare's trace service"""
    try:
        # Primary method: Cloudflare trace
        result = subprocess.run(['curl', '-s', 'https://1.1.1.1/cdn-cgi/trace'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            for line in result.stdout.splitlines():
                if line.startswith('ip='):
                    return line.split('=')[1].strip()
        
        # Fallback method: ifconfig.co
        result = subprocess.run(['curl', '-s', 'https://ifconfig.co'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            return result.stdout.strip()
            
    except Exception as e:
        logging.error(f"Error fetching IP: {e}")
        return None
    
    return None

def update_dns_record(new_ip):
    """Update Cloudflare DNS record with new IP"""
    zone_id = os.getenv('CF_ZONE_ID')
    record_id = os.getenv('DYN_ID')
    token = os.getenv('CF_DNS_TOKEN')
    
    if not all([zone_id, record_id, token]):
        logging.error("Missing required environment variables: CF_ZONE_ID, DYN_ID, CF_DNS_TOKEN")
        return False
    
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "type": "A",
        "name": "ivo-tech.com",
        "content": new_ip,
        "ttl": 300,
        "proxied": True
    }
    
    try:
        response = requests.put(url, json=data, headers=headers, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        if result.get('success'):
            logging.info(f"DNS record updated successfully to {new_ip}")
            return True
        else:
            logging.error(f"Cloudflare API error: {result.get('errors', 'Unknown error')}")
            return False
            
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to update DNS record: {e}")
        return False

def main():
    """Main function"""
    logging.info("Starting Cloudflare DDNS update")
    
    # Get current IP
    current_ip = get_current_ip()
    if not current_ip:
        logging.error("Failed to get current IP address")
        sys.exit(1)
    
    logging.info(f"Current IP: {current_ip}")
    
    # Update DNS record
    if update_dns_record(current_ip):
        logging.info("DDNS update completed successfully")
        sys.exit(0)
    else:
        logging.error("DDNS update failed")
        sys.exit(1)

if __name__ == '__main__':
    main()
