import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

import { db } from '../../index';
import { users } from '../models/user';

export const getUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const numericId = parseInt(id, 10); // Convert id to a number
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await db.select().from(users).where(eq(users.id, numericId)).execute();
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { username, email, firstName, lastName } = req.body;
    console.log(req.body);
    const newUser = await db
      .insert(users)
      .values({
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
      })
      .execute();
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10); // Convert id to a number
    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const { username, email, firstName, lastName } = req.body;
    const updatedUser = await db
      .update(users)
      .set({
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
      })
      .where(eq(users.id, numericId))
      .execute(); // Use numericId here
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
