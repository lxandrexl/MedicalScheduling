const { Sequelize } = require("sequelize");

class SequelizeService {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        dialect: "mysql",
        logging: false,
        dialectOptions: {
          dateStrings: true,
          typeCast: true,
        },
        define: {
          timestamps: false,
        },
      }
    );
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  getInstance() {
    return this.sequelize;
  }
}

module.exports = { SequelizeService };
