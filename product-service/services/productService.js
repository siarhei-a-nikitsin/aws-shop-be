import productsData from '../data/products.json';

export const getProducts = async () => productsData;

export const getProductById = async (productId) => {
  const products = await getProducts();

  return products.find((x) => x.id === productId);
};

export default { getProducts, getProductById };
