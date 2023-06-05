const config = () => ({
  port: process.env.APP_PORT || 8080,
  database: {
    host: process.env.APP_DATABASE_URL,
    user: process.env.USER_DATA_BASE,
    password: process.env.PASS_DATA_BASE,
    database: process.env.DATA_BASE,
    dialect: process.env.DIALECT,
    port: process.env.PORT_DATA_BASE,
  },
});

export default config;
