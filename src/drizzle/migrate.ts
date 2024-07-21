import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';
import { sql } from 'drizzle-orm';

async function migration() {
  console.log('======== Migrations started ========');

  try {
    // Add missing columns to the vehicle_specifications table
    await db.execute(sql`
      ALTER TABLE vehicle_specifications 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    
    // Add vehicle_image column to vehicles table if it does not exist
    await db.execute(sql`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_image VARCHAR(255);`);

    console.log('======== Migrations completed ========');
  } catch (err) {
    const error = err as Error; // Cast error to Error type
    console.error('Migration error:', error.message);
  } finally {
    process.exit(0);
  }
}

migration().catch((err) => {
  const error = err as Error; // Cast error to Error type
  console.error('Migration error:', error.message);
  process.exit(1);
});
