import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error: any) {
    console.error("Something went wrong while starting the server:", error.message);
    process.exit(1);
  }
}

startServer();
