import Products from '@/components/Products';
import { getAllProducts } from '@/services/products/get-products';
import { Typography } from '@mui/material';

export default async function AllProducts() {
  const { data: products } = await getAllProducts();

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', paddingBottom: 2 }}>
        All Products
      </Typography>
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
