import { CustomResponseType, InserOrderType } from '@/types';

export default async function addOrder(orderData: InserOrderType): Promise<
  CustomResponseType<{
    orderId: string;
  }>
> {
  try {
    const response = await fetch('/api/orders/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-order. ${error}`);
  }
}
