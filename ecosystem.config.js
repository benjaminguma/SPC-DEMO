module.exports = {
  apps: [
    {
      name: 'wisaal',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'wisaal_staging',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};

//
