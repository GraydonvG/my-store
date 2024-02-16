'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetAllProductData, setImageData, setProductFormData } from '@/lib/redux/productForm/productFormSlice';
import deleteProduct from '@/services/products/delete';
import revalidate from '@/services/revalidate';
import { ProductType } from '@/types';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ContainedButton from '../buttons/ContainedButton';
import { DeleteForever } from '@mui/icons-material';

type Props = {
  product: ProductType;
};

export default function AdminButtonsProductCard({ product }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { imageData } = useAppSelector((state) => state.productForm);
  const { productImageData, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSetProductDataForUpdate() {
    setIsLoading(true);

    if (imageData && !product.productId) {
      const { success, message } = await deleteAllProductImages(imageData);
      if (success === false) {
        toast.error(message);
      }
    }

    dispatch(resetAllProductData());
    dispatch(setImageData(product.productImageData));
    dispatch(setProductFormData(restOfProductData));
    setIsLoading(false);
    router.push('/admin-view/add-product');
  }

  async function handleRevalidate() {
    const data = await revalidate('/');

    if (data.success === true) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }
  }

  async function handleDeleteProduct() {
    setIsDeletingProduct(true);

    const deleteImagesPromise = deleteAllProductImages(productImageData);
    const deleteProductPromise = deleteProduct(product.productId!);

    const [deleteImagesResult, deleteProductResult] = await Promise.all([deleteImagesPromise, deleteProductPromise]);

    const { success: deleteImagesSuccess, message: deleteImagesMessage } = deleteImagesResult;
    const { success: deleteProductSuccess, message: deleteProductMessage } = deleteProductResult;

    if (deleteImagesSuccess === true && deleteProductSuccess === true) {
      await handleRevalidate();
      toast.success('Product deleted successfully.');
    } else if (deleteImagesSuccess === false) {
      toast.error(deleteImagesMessage);
    } else if (deleteProductSuccess === false) {
      toast.error(deleteProductMessage);
    }

    setIsDeletingProduct(false);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flexGrow: 1,
        paddingY: 1,
        gap: 1,
      }}>
      <ContainedButton
        disabled={isDeletingProduct || isLoading}
        onClick={handleDeleteProduct}
        fullWidth
        label={isDeletingProduct ? '' : 'delete'}
        isLoading={isDeletingProduct}
        startIcon={<DeleteForever />}
        backgroundColor="warning"
      />
      <ContainedButton
        disabled={isLoading || isDeletingProduct}
        onClick={handleSetProductDataForUpdate}
        fullWidth
        label={isLoading ? '' : 'update'}
        isLoading={isLoading}
        backgroundColor="primary"
      />
    </Box>
  );
}