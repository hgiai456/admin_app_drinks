import dotenv from 'dotenv';
dotenv.config();

const development = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DEV_DIALECT || 'mysql'
};
// ✅ SỬA EXPORT SYNTAX CHO SEQUELIZE CLI
export { development };
export default {
    development
};
