import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { drizzle } from 'drizzle-orm/mysql2/driver';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { createConnection } from 'mysql2';

// import { db } from './src/index';

dotenv.config();

export default defineConfig({
  schema: 'src/api/models/*',
  out: 'db/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  },
  verbose: true,
  strict: true,
});

const connection = createConnection({
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

const db = drizzle(connection);

migrate(db, { migrationsFolder: 'db/drizzle/migrations' }).then(() => {
  console.log('Migrations applied successfully');
});
