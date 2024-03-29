import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsCartOpen } from '@/lib/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import OutlinedButton from '../../ui/buttons/OutlinedButton';
import { selectCartTotal, selectDiscountTotal } from '@/lib/redux/selectors/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import CheckoutButton from '../../ui/buttons/CheckoutButton';

export default function FooterCartDrawer() {
  const router = useRouter();
  const colorPalette = useColorPalette();
  const { isCartOpen, cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const orderTotal = selectCartTotal(cartItems);
  const discountTotal = selectDiscountTotal(cartItems);

  function closeCartDrawer() {
    if (isCartOpen === true) {
      dispatch(setIsCartOpen(false));
    }
  }

  function navigateToCartView() {
    closeCartDrawer();
    router.push('/cart/view');
  }

  return (
    <Box
      sx={{
        position: 'relative',
        padding: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          boxShadow: `0 -2px 4px 0 ${colorPalette.boxShadow}`,
          top: 0,
          right: 0,
          left: 0,
          height: '4px',
        },
      }}>
      {discountTotal > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            textTransform: 'uppercase',
            justifyContent: 'space-between',
            paddingBottom: 1,
          }}>
          <Typography
            component="span"
            fontSize={16}
            fontWeight={700}>
            Discount
          </Typography>
          <Typography
            component="span"
            fontSize={16}
            fontWeight={700}>
            {formatCurrency(discountTotal)}
          </Typography>
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingBottom: 2,
          textTransform: 'uppercase',
        }}>
        <Typography
          component="span"
          fontSize={24}
          fontWeight={700}>
          total
        </Typography>
        <Typography
          component="span"
          fontSize={24}
          fontWeight={700}>
          {formatCurrency(orderTotal - discountTotal)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <OutlinedButton
          onClick={navigateToCartView}
          fullWidth
          label="view cart"
        />
        <CheckoutButton
          backgroundColor="primary"
          fullWidth
          label="checkout"
        />
      </Box>
    </Box>
  );
}
