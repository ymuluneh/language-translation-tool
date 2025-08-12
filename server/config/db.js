import mysql from "mysql2/promise";
//use environmental variables
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "translations_db",
  password: process.env.DB_PASSWORD || "translations_db",
  database: process.env.DB_NAME || "translations_db",
});

export default pool;
