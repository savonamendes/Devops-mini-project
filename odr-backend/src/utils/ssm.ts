import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient({});

/**
 * Loads an array of parameter names from AWS SSM Parameter Store.
 * Parameters are expected to be stored as PlainString.
 * Values are set on `process.env` with the same name.
 */
export async function loadSSMParameters(
  paramNames: string[]
): Promise<void> {
  for (const name of paramNames) {
    const cmd = new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    });
    const resp = await client.send(cmd);
    if (resp.Parameter?.Value) {
      process.env[name] = resp.Parameter.Value;
    } else {
      throw new Error(`SSM parameter ${name} not found`);
    }
  }
}
