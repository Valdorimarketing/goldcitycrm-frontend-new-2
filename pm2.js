module.exports = {
  apps: [

    {
      name: "crm-frontend-tr2",
      script: "npm",
      args: "start",

      env: {
        NODE_ENV: "production",
        NITRO_PORT: "3003",
      }
    },
  ],
}

