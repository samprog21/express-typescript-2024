import { and, eq, gte, like, lte } from 'drizzle-orm';
import { Request, Response } from 'express';

import { db } from '../../index'; // Adjust the import path as necessary
import { products } from '../models/products';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const imageUrl = (req.file as any)?.location;

    const newProduct = await db
      .insert(products)
      .values({
        name: name,
        image: imageUrl, // Use the URL from S3
        price: price,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const imageUrl = (req.file as any)?.location;

    const updatedProduct = await db
      .update(products)
      .set({
        name: name,
        image: imageUrl,
        price: price,
        updated_at: new Date(),
      })
      .where(eq(products.id, Number(id)))
      .execute();

    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db
      .delete(products)
      .where(eq(products.id, Number(id)))
      .execute();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, name, startDate, endDate } = req.query;
    const offset = ((page as number) - 1) * (limit as number);

    const query = db.select().from(products);

    if (name) {
      query.where(like(products.name, `%${name}%`));
    }

    if (startDate && endDate) {
      query.where(
        and(
          gte(products.created_at, new Date(startDate as string)),
          lte(products.created_at, new Date(endDate as string))
        )
      );
    }

    const productsList = await query
      .orderBy(products.created_at, 'DESC')
      .limit(limit as number)
      .offset(offset);

    res.json(productsList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
