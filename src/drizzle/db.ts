import "dotenv/config";
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import Stripe from 'stripe';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema, logger: true });

// export const stripe = new Stripe(process.env. as string,{
//   apiVersion: '2024-06-20',
//   typescript: true
// })