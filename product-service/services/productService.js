import Joi from "joi";

import { createClient } from "./dal/client";

export const getProducts = async () => {
  const client = createClient();

  await client.connect();

  try {
    const { rows: products } = await client.query(`
            select p.id, p.title, p.description, p.price, s.count
            from products p
            join stocks s on s.product_id = p.id
        `);

    return products;
  } finally {
    await client.end();
  }
};

export const getProductById = async (productId) => {
  const client = createClient();

  await client.connect();

  try {
    const { rows: products } = await client.query(
      `
            select p.id, p.title, p.description, p.price, s.count
            from products p
            join stocks s on s.product_id = p.id
            where p.id=$1
        `,
      [productId]
    );

    return products[0];
  } finally {
    await client.end();
  }
};

const newProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(null, "").optional(),
  price: Joi.number().integer().greater(0).allow(null).optional(),
  count: Joi.number().integer().min(0).allow(null).optional(),
});

export const createProduct = async (data) => {
  const { error } = newProductSchema.validate(data);

  if (error) {
    throw error;
  }

  const { title, description, price, count } = data;

  const client = createClient();
  await client.connect();

  try {
    client.query("BEGIN");

    const createProductQuery = `
            insert into products (title, description, price)
            values ($1, $2, $3)
            returning id
        `;

    const { rows } = await client.query(createProductQuery, [
      title,
      description,
      price,
    ]);
    const newProductId = rows[0].id;

    const createProductStock =
      "insert into stocks (product_id, count) values($1, $2)";
    await client.query(createProductStock, [newProductId, count]);

    await client.query("COMMIT");

    return newProductId;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    await client.end();
  }
};

export const createProducts = async (products) => {
  products.forEach((product) => {
    const { error } = newProductSchema.validate(product);
    if (error) {
      throw error;
    }
  });

  const client = createClient();
  await client.connect();

  try {
    client.query("BEGIN");

    const formattedProducts = products.map(({ title, description, price }) => [
      title,
      description,
      price,
    ]);

    const createProductsQuery = format(
      "insert into products (title, description, price) values %L returning id",
      formattedProducts
    );
    const { rows } = await client.query(createProductsQuery);
    const newProductIds = rows.map(({ id }) => id);

    const formattedCount = products.map(({ count }, index) => [
      newProductIds[index],
      count,
    ]);
    const createProductStock = format(
      "insert into stocks (product_id, count) values %L",
      formattedCount
    );
    await client.query(createProductStock);

    await client.query("COMMIT");

    return newProductIds;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
};

export default { getProducts, getProductById, createProduct };
