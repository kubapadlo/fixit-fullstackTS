import dotenv from 'dotenv'
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  try {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error: any) {
    console.error("Something went wrong while starting the server:", error.message);
    process.exit(1);
  }
}

startServer();
