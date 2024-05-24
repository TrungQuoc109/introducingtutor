import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const db = process.env.DB_NAME ?? "";
const host = process.env.DB_HOST ?? "localhost";
const username = process.env.DB_USER ?? "postgres";
const password = process.env.DB_PASSWORD ?? "postgres";
const sequelize = new Sequelize({
    dialect: "postgres",
    host: host,
    port: process.env.DB_PORT,
    username: username,
    password: password,
    database: db,
    dialectOptions: {
        ssl: false,
    },
});

// Kiểm tra kết nối
sequelize
    .authenticate()
    .then(() => {
        console.log("Kết nối thành công.");
    })
    .catch((err) => {
        console.error("Không thể kết nối:", err);
    });

export { sequelize };
