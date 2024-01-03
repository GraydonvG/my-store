import { loadStripe } from '@stripe/stripe-js';
import { calculateDiscountedCartItemPrice } from './calculateDiscountedPrice';
import { callStripeSession } from '@/services/stripe/call-stripe-session';
import { CartItemType } from '@/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default async function payWithStripe(cartItems: CartItemType[]) {
  const stripe = await stripePromise;
  const createLineItems = cartItems.map((item) => {
    const unitAmount = (item?.product?.on_sale ? calculateDiscountedCartItemPrice(item) : item?.product?.price!) * 100;
    const roundedAmount = Math.round(unitAmount);
    const images = item?.product?.product_image_data.map((data) => data.image_url);

    return {
      price_data: {
        currency: 'zar',
        product_data: {
          name: item?.product?.name,
          images,
        },
        unit_amount: roundedAmount,
      },
      quantity: item?.quantity,
    };
  });

  const { data } = await callStripeSession(createLineItems);

  const error = await stripe?.redirectToCheckout({
    sessionId: data?.sessionId!,
  });

  console.log(error);
}
