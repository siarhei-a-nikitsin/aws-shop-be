import { createProducts } from "../services/productService";
import { sendNewProductsNotification } from "../services/notificationService";

const handler = async event => {
  const products = event.Records.map(({ body }) => JSON.parse(body));

  try {
    await createProducts(products);
    await sendNewProductsNotification(products)
  } catch (error) {
    console.log(error);
  }
};

export default handler;