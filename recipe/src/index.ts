import { app } from "./app";
import { config } from "./config"; // Import from config module

const start = async () => {
  try {
    // Start the server and print the database URL
    app.listen(config.port, () => {
      console.log(`Connected to database at: ${config.databaseUrl}`);
      console.log(`Recipe service is now listening on port ${config.port}!`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1); // Exit process with failure code
  }
};

start();
