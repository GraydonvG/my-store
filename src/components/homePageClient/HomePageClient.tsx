'use client';

import { ProductType } from '@/types';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import HeroSection from './HeroSection';
import ProductPreviewSection from './productPreviewSection/ProductPreviewSection';
import ShopByCategorySection from './ShopByCategorySection';

type HomePageClientProps = {
  allProducts: ProductType[] | undefined;
  saleProducts: ProductType[] | undefined;
};

export default function HomePageClient({ allProducts, saleProducts }: HomePageClientProps) {
  const router = useRouter();
  const productsOnSale = saleProducts?.slice(0, 3);
  const latestArrivals = allProducts?.filter((product) => product.isOnSale === 'No').slice(0, 3);

  function navigateToAllProducts() {
    router.push('/products/all-products');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <HeroSection navigateToAllProducts={navigateToAllProducts} />
      <ProductPreviewSection
        latestArrivals={latestArrivals}
        productsOnSale={productsOnSale}
        navigateToAllProducts={navigateToAllProducts}
      />
      <ShopByCategorySection />
    </Box>
  );
}
