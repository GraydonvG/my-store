'use client';

import { ReactNode, useState } from 'react';
import CommonLayoutContainer from '@/components/ui/containers/CommonLayoutContainer';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectDeliveryFee,
  selectOrderTotal,
  selectTotalDiscount,
  selectTotalToPay,
} from '@/lib/redux/cart/cartSelectors';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';
import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { borderRadius } from '@/constants/styles';
import { loadStripe } from '@stripe/stripe-js';
import { callStripeSession } from '@/services/stripe/call-stripe-session';
import { calculateDiscountedCartItemPrice, calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  children: ReactNode;
};

export default function CheckoutFlowLayout({ children }: Props) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useAppSelector((state) => state.cart);
  const checkoutData = useAppSelector((state) => state.checkoutData);
  const orderTotal = selectOrderTotal(cartItems);
  const totalDiscount = selectTotalDiscount(cartItems);
  const deliveryFee = selectDeliveryFee(cartItems);
  const totalToPay = selectTotalToPay(cartItems);
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cardBackgroundColor = mode === 'dark' ? customColorPalette.grey.dark : 'white';
  const dividerColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
  const isCartView = pathname.includes('/cart/view');
  const isShippingView = pathname.includes('/checkout/shipping');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  function handleNavigate() {
    dispatch(setCheckoutData({ ...checkoutData, totalToPay }));
    router.push('/checkout/shipping');
  }

  async function handlePayment() {
    const stripe = await stripePromise;
    const createLineItems = cartItems.map((item) => {
      const unit_amount =
        (item?.product?.on_sale ? calculateDiscountedCartItemPrice(item) : item?.product?.price!) * 100;
      const images = item?.product?.product_image_data.map((data) => data.image_url);

      return {
        price_data: {
          currency: 'zar',
          product_data: {
            name: item?.product?.name,
            images,
          },
          unit_amount,
        },

        quantity: item?.quantity,
      };
    });

    const { data } = await callStripeSession(createLineItems);

    setIsProcessingOrder(true);

    localStorage.setItem('stripe', 'true');

    const error = await stripe?.redirectToCheckout({
      sessionId: data?.sessionId!,
    });

    console.log(error);
  }

  function renderOrderTotals({
    label,
    price,
    fontSize,
    fontWeight,
    backgroundColor,
  }: {
    label: string;
    price: string;
    fontSize: number;
    fontWeight?: number;
    backgroundColor?: string;
  }) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 1,
          padding: 1,
          backgroundColor,
          borderRadius: borderRadius,
        }}>
        <Typography
          paddingRight={2}
          component="span"
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {label}
        </Typography>
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography
            component="span"
            fontSize={fontSize}
            fontWeight={fontWeight}>
            {price}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <CommonLayoutContainer>
      <Grid
        container
        spacing={2}>
        <Grid
          item
          xs={12}
          md={9}>
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          md={3}>
          <Box
            sx={{
              paddingX: 3,
              paddingY: 4,
              backgroundColor: cardBackgroundColor,
              borderRadius: borderRadius,
            }}>
            <Typography
              component="h1"
              fontFamily="Source Sans Pro,sans-serif"
              fontSize={30}
              lineHeight={1}>
              Your Order
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 2 }}>
              {renderOrderTotals({
                label: 'Cart total',
                price: formatCurrency(orderTotal),

                fontSize: 14,
              })}
              {totalDiscount > 0
                ? renderOrderTotals({
                    label: 'Discount total',
                    price: `-${formatCurrency(totalDiscount)}`,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: '#42a5f517',
                  })
                : null}
              {renderOrderTotals({
                label: 'Delivery fee',
                price: orderTotal > 0 ? (deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)) : formatCurrency(0),
                fontSize: 14,
              })}
              <Divider />
              {renderOrderTotals({
                label: 'Order total',
                price: formatCurrency(totalToPay),
                fontSize: 14,
                fontWeight: 600,
              })}
              <Divider sx={{ border: `1.5px solid ${dividerColor}` }} />
              {renderOrderTotals({
                label: 'TOTAL TO PAY',
                price: formatCurrency(totalToPay),
                fontSize: 18,
                fontWeight: 700,
              })}
            </Box>
            <ContainedButton
              disabled={cartItems.length === 0 || (isShippingView && !checkoutData.shippingAddress)}
              onClick={isCartView ? handleNavigate : handlePayment}
              label={(isCartView && 'checkout now') || (isShippingView && 'continue to payment')}
              fullWidth
              backgroundColor={isCartView ? 'blue' : 'red'}
            />
          </Box>
        </Grid>
      </Grid>
    </CommonLayoutContainer>
  );
}
