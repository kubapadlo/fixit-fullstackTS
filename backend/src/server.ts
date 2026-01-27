import dotenv from 'dotenv';
dotenv.config();
import {connectDB} from "./config/db";
import app from "./app";

// Repozytoria
import { PrismaUserRepository } from "./repositories/prisma/user.prisma.repository";
import { MongooseUserRepository } from "./repositories/mongoose/user.mongoose.repository";
import { PrismaFaultRepository } from "./repositories/prisma/prisma.fault.repository";
import { MongooseFaultRepository } from "./repositories/mongoose/mongoose.fault.repository";

// Serwisy i Kontrolery
import { AuthService } from "./services/auth.service";
import { FaultService } from "./services/fault.service";
import { AuthController } from "./controllers/authController";
import { FaultController } from "./controllers/faultController";

// Routery (jako funkcje)
import { createAuthRouter } from "./routers/authRoutes";
import { createFaultRouter } from "./routers/faultRouter";
import globalErrorHandler from './middleware/globalErrorHandler';

const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  try {
    if(process.env.DB_TYPE !== "mongo" && process.env.DB_TYPE !== "sql") {
      throw new Error("Invalid DB_TYPE in .env. Use 'mongo' or 'sql'.");
    }
    
    // 1. Połączenie z bazą (na podstawie DB_TYPE w .env)
    await connectDB();

    // 2. Wstrzykiwanie zależności - WARSTWA DANYCH
    const userRepository = process.env.DB_TYPE === "mongo" 
      ? new MongooseUserRepository() 
      : new PrismaUserRepository();
    const faultRepository = process.env.DB_TYPE === "mongo"
      ? new MongooseFaultRepository()
      : new PrismaFaultRepository();

    // 3. Wstrzykiwanie zależności - WARSTWA LOGIKI
    const authService = new AuthService(userRepository);
    const faultService = new FaultService(faultRepository, userRepository);
    // 4. Wstrzykiwanie zależności - WARSTWA HTTP
    const authController = new AuthController(authService);
    const faultController = new FaultController(faultService);

    // 5. MONTAŻ ROUTERÓW
    // Przekazujemy zainicjalizowany kontroler do funkcji routera
    app.use("/api/auth", createAuthRouter(authController));
    app.use("/api/user", createFaultRouter(faultController));

    // 6. Globalny handler błędów
    app.use(globalErrorHandler);

    app.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`Server running on port ${PORT}`);
      console.log(`Database: ${process.env.DB_TYPE?.toUpperCase()}`);
      console.log(`=================================`);
    });
  } catch (error: any) {
    console.error("Starting server failed:", error.message);
    process.exit(1);
  }
}

startServer();