import { PoolClient, Pool } from "pg";

let pool: Pool;

export async function getClient(): Promise<PoolClient> {
  if (pool == null) pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  return client;
}
