#!/usr/bin/env bash

# ---------------------------------------------------------------------------
# EC2 Initial Setup Script for devops-mini-project
# ---------------------------------------------------------------------------
# This script automates the installation of all required system packages,
# Docker, Docker Compose, Node.js, Bun, and brings up the full stack using
# docker-compose. It is intended to be run on a fresh Amazon Linux 2 or Ubuntu
# EC2 instance (Ubuntu 22.04 LTS is the primary target).
# ---------------------------------------------------------------------------

set -euo pipefail

# Helper functions -----------------------------------------------------------
log() {
  echo -e "\e[1;34[INFO]\e[0m $*"
}
error() {
  echo -e "\e[1;31[ERROR]\e[0m $*" >&2
  exit 1
}

# Detect OS ---------------------------------------------------------------
if [[ -f /etc/os-release ]]; then
  . /etc/os-release
  OS=$ID
else
  error "Cannot determine operating system"
fi

log "Detected OS: $OS"

# Update package index ------------------------------------------------------
log "Updating package lists..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
  sudo apt-get update -y
elif [[ "$OS" == "amzn" ]]; then
  sudo yum update -y
else
  error "Unsupported OS: $OS"
fi

# Install prerequisite packages --------------------------------------------
log "Installing prerequisite packages..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
  sudo apt-get install -y \
    ca-certificates \ 
    curl \ 
    gnupg \ 
    lsb-release \ 
    git \ 
    unzip \ 
    python3 \ 
    make \ 
    gcc \ 
    g++ \ 
    openssl
elif [[ "$OS" == "amzn" ]]; then
  sudo yum install -y \ 
    ca-certificates \ 
    curl \ 
    gnupg2 \ 
    git \ 
    unzip \ 
    python3 \ 
    make \ 
    gcc \ 
    gcc-c++ \ 
    openssl
fi

# Install Docker -----------------------------------------------------------
log "Setting up Docker..."
if ! command -v docker >/dev/null 2>&1; then
  if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
  elif [[ "$OS" == "amzn" ]]; then
    sudo amazon-linux-extras install docker -y
    sudo service docker start
  fi
  sudo usermod -aG docker $USER
else
  log "Docker already installed"
fi

# Install Docker Compose ----------------------------------------------------
log "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION="2.27.0"
if ! docker compose version >/dev/null 2>&1; then
  if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  elif [[ "$OS" == "amzn" ]]; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  fi
else
  log "Docker Compose already present"
fi

# Install Node.js (LTS) ----------------------------------------------------
log "Installing Node.js LTS (v20)..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  log "Node.js already installed"
fi

# Install Bun ---------------------------------------------------------------
log "Installing Bun (latest stable)..."
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
  # Add bun to PATH for the current session
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
else
  log "Bun already installed"
fi

# Clone the repository -----------------------------------------------------
PROJECT_DIR="devops-mini-project"
if [[ -d "$PROJECT_DIR" ]]; then
  log "Project directory already exists – pulling latest changes"
  pushd "$PROJECT_DIR"
  git pull
  popd
else
  log "Cloning repository..."
  # Replace the URL with your actual repository URL if needed
  git clone https://github.com/savonamendes/Devops-mini-project.git 
fi

# Move into project directory
cd "$PROJECT_DIR"

# Ensure Docker Compose uses the correct file (default is docker-compose.yml)
log "Building and starting Docker Compose stack..."
# Build images first to surface any build errors early
sudo docker compose build
# Bring services up in detached mode
sudo docker compose up -d

log "Setup complete!"
log "Available services:"
log " - Frontend: http://$(hostname -I | awk '{print $1}'):3000"
log " - Backend (internal): http://backend:4000 (accessible from other containers)"
log " - Prometheus: http://$(hostname -I | awk '{print $1}'):9090"
log " - Grafana: http://$(hostname -I | awk '{print $1}'):3001"
log " - Kibana: http://$(hostname -I | awk '{print $1}'):5601"

# Optional: Open firewall ports (uncomment if using ufw)
# log "Configuring firewall..."
# sudo ufw allow 22/tcp   # SSH
# sudo ufw allow 3000/tcp # Frontend
# sudo ufw allow 9090/tcp # Prometheus
# sudo ufw allow 3001/tcp # Grafana
# sudo ufw allow 5601/tcp # Kibana
# sudo ufw enable

exit 0
