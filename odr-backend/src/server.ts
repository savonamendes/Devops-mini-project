import dotenv from "dotenv";
import path from "path";

// Determine which environment file to load
const environment = process.env.NODE_ENV || 'production';
const envFile = environment === 'production' ? '.env.production' : '.env.development';

// Load the appropriate environment file.
// In Docker, env vars are injected by docker-compose – dotenv will
// silently skip if the file doesn't exist (override:false keeps
// container-injected vars as-is).
dotenv.config({ path: path.resolve(process.cwd(), envFile), override: false });

console.log(`Loading environment from: ${envFile} (if present)`);
console.log(`Environment: ${environment}`);

// Load AWS credentials and config from SSM Parameter Store
import { loadSSMParameters } from "./utils/ssm";

async function startServer() {
  try {
    await loadSSMParameters([
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_REGION",
      "S3_BUCKET_NAME",
    ]);
    console.log('AWS parameters loaded from SSM');
  } catch (err) {
    console.error('Failed to load SSM parameters:', err);
    // Don't fail the whole app if SSM fails in dev, but in prod we might want to exit.
    // For now, continue without them (in case local .env is used)
  }

  // Add environment validation
  if (!process.env.TOGETHER_API_KEY && !process.env.LAMBDA_CHAT_URL) {
    console.error(`ERROR: Either TOGETHER_API_KEY or LAMBDA_CHAT_URL environment variable is required!`);
    process.exit(1);
  }

  // Import app dynamically or use require so that modules
  // don't try to use env variables before they are loaded
  const app = (await import("./app")).default;

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Environment: ${environment}`);
    console.log(`Together AI API Key loaded: ${process.env.TOGETHER_API_KEY ? 'Yes' : 'No'}`);
    console.log(`Lambda chat URL loaded: ${process.env.LAMBDA_CHAT_URL ? 'Yes' : 'No'}`);
  });
}

startServer();
