import { bigint, datetime, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  username: varchar('username', { length: 256 }),
  email: varchar('email', { length: 256 }),
  first_name: varchar('first_name', { length: 256 }),
  last_name: varchar('last_name', { length: 256 }),
  created_at: datetime('created_at'),
  updated_at: datetime('updated_at'),
});
