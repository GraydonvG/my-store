'use client';

import CartItemLarge from '@/components/cartItems/CartItemLarge';
import { borderRadius } from '@/constants/styles';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { CartItemType } from '@/types';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

type CartEmptyProps = {
  show: boolean;
};

function CartEmpty({ show }: CartEmptyProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: customColorPalette.card.background,
        borderRadius: borderRadius,
        paddingX: 2,
        paddingY: 4,
      }}>
      <Typography
        component="p"
        fontSize={30}>
        Your cart is empty
      </Typography>
      <Link href={'/products/all-products'}>
        <Typography
          component="p"
          fontSize={24}
          sx={{ textDecoration: 'underline', color: customColorPalette.primary.dark }}>
          Continue shopping
        </Typography>
      </Link>
    </Box>
  );
}

type CartItemsProps = {
  show: boolean;
  cartItems: CartItemType[];
};

function CartItems({ show, cartItems }: CartItemsProps) {
  if (!show) return null;

  return (
    <>
      {cartItems.map((item) => (
        <CartItemLarge
          key={item?.cartItemId}
          item={item}
        />
      ))}
    </>
  );
}

export default function CartView() {
  const { cartItems } = useAppSelector((state) => state.cart);

  return (
    <>
      <CartEmpty show={cartItems.length === 0} />
      <CartItems
        show={cartItems.length !== 0}
        cartItems={cartItems}
      />
    </>
  );
}
