const app = require("./app");
const connectDB = require("./config/db.js");
const User = require("./models/user.model.js");

async function startServer() {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is listening on port 5000...");
    });
  } catch (error) {
    console.log("Sth went wrong while starting a server: ", error.message);
  }
}

startServer();
