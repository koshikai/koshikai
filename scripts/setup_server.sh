#!/bin/bash

# setup_server.sh
# Run this script on your Proxmox server or VM to prepare the directories.

set -e

echo "Setting up directories for koshikai deployment..."

# 1. Prepare Deployment Directory
echo "Creating /opt/home..."
sudo mkdir -p /opt/home
# Grant permissions to the 'runner' user
sudo chown -R runner:runner /opt/home
sudo chmod 755 /opt/home

# 2. Prepare Actions Runner Directory
echo "Creating /opt/actions-runner-home..."
sudo mkdir -p /opt/actions-runner-home
sudo chown -R runner:runner /opt/actions-runner-home
sudo chmod 755 /opt/actions-runner-home

echo "Directories created successfully."
echo "---------------------------------------------------"
echo "Instructions:"
echo "1. Install the GitHub Actions Runner in /opt/actions-runner-home"
echo "   (Check your GitHub Repo Settings > Actions > Runners for the exact commands)"
echo "2. Place your .env.prod in /opt/home for the public portfolio"
echo "3. If you want the internal stack too, place .env.mathkb in /opt/home"
echo "4. Compose files are synced automatically by GitHub Actions on each deploy"
echo "---------------------------------------------------"
