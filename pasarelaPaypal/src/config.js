import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import sequelize from './connection/connection.js';
import { Datos } from './models/datos.js';
import datosRoutes from './routes/datos.routes.js';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();
class Server {
  app;
  port;

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.listen();
    this.routes();
    this.DbConnection();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server corriendo en el puerto ${this.port}`);
    });
  }
  middlewares() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Métodos permitidos
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use((req, res, next) => {
      res.setTimeout(60000, () => {
        // 2 minutos
        console.log("Request has timed out.");
        res.status(408).send("Request has timed out.");
      });
      next();
    });
  }

  routes() {
    this.app.use(paymentRoutes);
    this.app.use(datosRoutes);
  }

  async DbConnection(){
    try {
      /* {force: true}{alter: true} */
      await sequelize.authenticate();
      await Datos.sync({alter: true})
      console.log("Conexión a la base de datos exitosa");
      }catch (error) {
        console.log("Error al conectar a la base de datos", error);
      }
  }

}

export default Server;
