import getURL from '@/lib/utils';
import { CustomResponseType, ProductType } from '@/types';

export default async function getAllProducts(): Promise<CustomResponseType<ProductType[]>> {
  const url = getURL('/api/products/get-all');

  try {
    const response = await fetch(url, {
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-products. ${error}`);
  }
}
