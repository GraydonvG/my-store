import { CustomResponseType } from '@/types';

export async function updateCartItemSize(cartItemData: {
  cartItemId: string;
  size: string;
}): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/update/size', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-cart-item. ${error}`);
  }
}

export async function updateCartItemQuantity(cartItemData: {
  cartItemId: string;
  quantity: number;
}): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/update/quantity', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-cart-item. ${error}`);
  }
}
