import { Client } from "pg";

let client: Client;

export async function getClient(): Promise<Client> {
  if (client) return client;
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  await client.connect();
  return client;
}
