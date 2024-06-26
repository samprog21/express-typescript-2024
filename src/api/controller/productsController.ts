import { and, asc, eq, gte, like, lte } from 'drizzle-orm';
import { Request, Response } from 'express';

import { getObjectSignedUrl } from '../../common/utils/s3';
import { db } from '../../index';
import { products } from '../models/products';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, quantity } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageName = (req.file as Express.Multer.File & { key: string }).key;
    console.log('imageName', imageName);

    const newProduct = await db
      .insert(products)
      .values({
        name: name,
        image: imageName,
        price: price,
        description: description,
        quantity: quantity,
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
    const { name, price, description, quantity } = req.body;
    const imageName = (req.file as Express.Multer.File & { key: string })?.key;

    console.log('imageUrl', imageName);

    const updates: { name: any; price: any; description: any; updated_at: Date; image?: string; quantity: number } = {
      name: name,
      price: price,
      description: description,
      quantity: Number(quantity),
      updated_at: new Date(),
    };

    if (imageName) {
      updates.image = imageName;
    }

    const updatedProduct = await db
      .update(products)
      .set(updates)
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

// export async function getObjectSignedUrl(key) {
//   const params = {
//     Bucket: bucketName,
//     Key: key
//   }

//   // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
//   const command = new GetObjectCommand(params);
//   const seconds = 60
//   const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

//   return url
// }
export const listProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, name, dateRangeFrom: startDate, dateRangeTo: endDate, price } = req.query;

    const offset = ((page as number) - 1) * (limit as number);

    const query = db.select().from(products);

    if (name) {
      query.where(like(products.name, `%${name}%`));
    }

    if (price) {
      query.where(like(products.price, `%${price}%`));
    }

    if (startDate && endDate) {
      query.where(
        and(
          gte(products.created_at, new Date(startDate as string)),
          lte(products.created_at, new Date(endDate as string))
        )
      );
    }

    const productsList = await query.orderBy(asc(products.id)).offset(offset).limit(Number(limit)).execute();
    const productsWithImageUrl = await Promise.all(
      productsList.map(async (product) => {
        console.log('product', product);
        const imageUrl = product.image ? await getObjectSignedUrl(product.image) : null;
        console.log('imageUrl', imageUrl);
        return { ...product, image: imageUrl };
      })
    );
    res.json(productsWithImageUrl);

    // res.status(200).json({
    //   productsWithImageUrl,
    //   status: 200,
    //   message: 'Products list sent successfully',
    // });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)));

    const product = await query.execute();
    const productWithImageUrl = await Promise.all(
      product.map(async (product) => {
        const imageUrl = product.image ? await getObjectSignedUrl(product.image) : null;
        return { ...product, image: imageUrl };
      })
    );

    res.json(productWithImageUrl);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
