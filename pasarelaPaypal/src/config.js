import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import paymentRoutes from './routes/payment.routes.js';

dotenv.config();
class Server {
    app;
    port;
  
    constructor() {
      this.app = express();
      this.port = process.env.PORT || "4000,";
      this.middlewares();
      this.listen();
      this.routes();
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
          origin: "*", // Permite todas las solicitudes de origen cruzado
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
    }
  
}
  
  export default Server;
  
