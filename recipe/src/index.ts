import { app } from "./app";
import { loadConfig } from "./config"; // Import the async config loader

const start = async () => {
  try {
    // Load configuration (including database URL from Azure Key Vault)
    const config = await loadConfig();

    // Start the server after config is successfully loaded
    app.listen(config.port, () => {
      console.log(`Connected to database at: ${config.databaseUrl}`);
      console.log(`Recipe service is now listening on port ${config.port}!`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1); // Exit process with failure code
  }
};

// Execute the startup function
start();
