import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private connection: mysql.Pool;

// Constructor privado: Implementación del patrón Singleton
  private constructor() {
    this.connection = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });
    console.log("Conexión a Base De Datos establecida");
  }
  
// Devuelve la única instancia activa (Singleton)
  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public async close(): Promise<void> {
    await this.connection.end();
    console.log("Conexión a Base De Datos cerrada");
  }

  public getConnection(): mysql.Pool {
    return this.connection;
  }

  public async query(sql: string, params: any[] = []): Promise<any> {
    const [rows] = await this.connection.query(sql, params);
    return rows;
  }
}
