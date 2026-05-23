module.exports = {
  apps: [
    {
      name: 'glovia-backend',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      max_restarts: 5,
    },
  ],
};
