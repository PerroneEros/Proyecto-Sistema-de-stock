import fs from "fs";
import path from "path";
import { DatabaseConfig } from "../config/database";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
async function initDB() {
  try {
    const sqlPath = path.join(__dirname, "../dataBase/setup.sql");

    console.log(`Buscando archivo SQL en: ${sqlPath}`);

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No encontré el archivo setup.sql en ${sqlPath}`);
    }
    delete process.env.DB_NAME;
    const sql = fs.readFileSync(sqlPath, "utf8");

    const db = DatabaseConfig.getInstance();

    console.log("Ejecutando setup.sql...");

    // EJECUTAMOS EL SCRIPT
    await db.query(sql);

    console.log("Base de datos inicializada correctamente.");
    await db.close();
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1); // Salir con error
  }
}

initDB();
