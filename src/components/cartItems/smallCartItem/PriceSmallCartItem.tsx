import useColorPalette from '@/hooks/useColorPalette';
import { formatCurrency } from '@/utils/formatCurrency';
import { Box, Typography } from '@mui/material';

type Props = {
  isOnSale: boolean;
  price: number;
  discountedPrice: number;
};

export default function PriceSmallCartItem({ isOnSale, price, discountedPrice }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        width: 1,
      }}>
      {isOnSale ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
          }}>
          <Typography
            lineHeight={1}
            component="span"
            fontSize={16}
            fontWeight={700}
            color={colorPalette.typographyVariants.grey}
            sx={{ textDecoration: 'line-through' }}>
            {formatCurrency(price)}
          </Typography>
        </Box>
      ) : null}

      <Typography
        lineHeight={1}
        component="span"
        variant="h6"
        fontSize={16}
        fontWeight={700}>
        {formatCurrency(isOnSale ? discountedPrice : price)}
      </Typography>
    </Box>
  );
}
