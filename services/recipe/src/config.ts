// import { DefaultAzureCredential } from "@azure/identity";
// const { SecretClient } = require("@azure/keyvault-secrets");
const dotenv = require("dotenv");

// Load environment variables from .env file if available
dotenv.config();

export async function loadConfig() {
  // try {
  //   const credential = new DefaultAzureCredential();
  //   const vaultName = "FoodAppKeyVault";
  //   const url = `https://${vaultName}.vault.azure.net`;
  //   const client = new SecretClient(url, credential);

  //   // Fetch the secret from Azure Key Vault
  //   const secret = await client.getSecret("PostgresConnectionString");
  //   process.env.DATABASE_URL = secret.value;

  //   console.log("Successfully loaded secrets from Azure Key Vault.");
  // } catch (error: any) {
  //   // If Key Vault fails, it will fall back to using the .env file
  //   console.error(
  //     "Failed to load secrets from Azure Key Vault, using .env file instead:",
  //     error.message
  //   );
  // }

  // Validate environment variables after fetching secrets
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be defined");
  }

  // Set config based on the retrieved environment variables
  return {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL,
    isProduction: process.env.NODE_ENV === "production",
  };
}
