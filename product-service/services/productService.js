import productsData from '../data/products.json';

const getProducts = async () => productsData;

const getProductById = async (productId) => {
  const products = await getProducts();

  return products.find((x) => x.id === productId);
};

export default { getProducts, getProductById };
