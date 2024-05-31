import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import * as schema from './api/models';

dotenv.config();
async function clientdb() {
  // Initialize MySQL connection or pool
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || '',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  });

  return drizzle(connection, { schema, mode: 'default' });
  // await dbs.query.users.findMany(...);
}

export default clientdb;
