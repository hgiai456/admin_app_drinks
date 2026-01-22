import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "database_development",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: console.log,
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
