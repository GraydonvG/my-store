import { FREE_DELIVERY_THRESHOLD } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { Divider, Typography } from '@mui/material';

type Props = {
  discountedPrice: number;
  returnInfo: string;
};

export default function BottomDetailsLargeCartItem({ discountedPrice, returnInfo }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Typography
      lineHeight={1.6}
      component="p"
      fontSize={{ xs: 14, sm: 16 }}
      color={colorPalette.typographyVariants.grey}>
      {discountedPrice > FREE_DELIVERY_THRESHOLD ? (
        <>
          Delivery Free
          <Divider
            component="span"
            sx={{ marginX: 1 }}
            variant="fullWidth"
            orientation="vertical"
          />
        </>
      ) : null}
      {returnInfo}
    </Typography>
  );
}
