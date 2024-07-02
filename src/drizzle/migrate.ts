import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';

async function migration() {
  console.log('======== Migrations started ========');

  try {
    await migrate(db, {
        migrationsFolder: __dirname + "/migrations"
      });
    console.log('======== Migrations completed ========');
  } catch (err) {
    const error = err as Error;
    console.error('Migration error:', error.message);
  } finally {
    process.exit(0);
  }
}

migration().catch((err) => {
  const error = err as Error;
  console.error('Migration error:', error.message);
  process.exit(1);
});
