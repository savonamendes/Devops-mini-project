module.exports = {
  apps: [
    {
      name: "odrlab-frontend",
      script: "bun",
      args: "start",
      cwd: "/var/www/odrlab-frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M"
    }
  ]
};
