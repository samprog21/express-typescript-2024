import { bigint, datetime, decimal, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 2048 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  created_at: datetime('created_at'),
  updated_at: datetime('updated_at'),
});
