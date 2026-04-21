#!/usr/bin/env bash

set -euo pipefail

log() {
  echo -e "\e[1;34[INFO]\e[0m $*"
}
error() {
  echo -e "\e[1;31[ERROR]\e[0m $*" >&2
  exit 1
}

if [[ -f /etc/os-release ]]; then
  . /etc/os-release
  OS=$ID
else
  error "Cannot determine operating system"
fi

log "Detected OS: $OS"

log "Updating package lists..."
if [[ "$OS" == "ubuntu" || "$OS" == "debian" ]]; then
  sudo apt-get update -y
elif [[ "$OS" == "amzn" ]]; then
  sudo yum update -y
else
  error "Unsupported OS: $OS"
fi

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

log "Installing Node.js LTS (v20)..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  log "Node.js already installed"
fi

log "Installing Bun (latest stable)..."
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
else
  log "Bun already installed"
fi

PROJECT_DIR="devops-mini-project"
if [[ -d "$PROJECT_DIR" ]]; then
  log "Project directory already exists – pulling latest changes"
  pushd "$PROJECT_DIR"
  git pull
  popd
else
  log "Cloning repository..."
  git clone https://github.com/savonamendes/Devops-mini-project.git
fi

cd "$PROJECT_DIR"

log "Building and starting Docker Compose stack..."
sudo docker compose build
sudo docker compose up -d

log "Setup complete!"
log "Available services:"
log " - Frontend: http://$(hostname -I | awk '{print $1}'):3000"
log " - Backend (internal): http://backend:4000 (accessible from other containers)"
log " - Prometheus: http://$(hostname -I | awk '{print $1}'):9090"
log " - Grafana: http://$(hostname -I | awk '{print $1}'):3001"
log " - Kibana: http://$(hostname -I | awk '{print $1}'):5601"

exit 0
