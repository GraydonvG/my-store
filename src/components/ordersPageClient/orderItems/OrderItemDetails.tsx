import useColorPalette from '@/hooks/useColorPalette';
import { OrderItemType } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  orderItem: OrderItemType;
};

export default function OrderItemDetails({ orderItem }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Link href={`/products/${orderItem.product?.category.toLowerCase()}/${orderItem.product?.productId}`}>
        <Typography fontSize={18}>{orderItem.product?.name}</Typography>
      </Link>
      <Box>
        {[
          { label: 'qty', value: orderItem?.quantity },
          { label: 'fontSize', value: orderItem?.size },
          { label: 'price paid', value: formatCurrency(orderItem?.pricePaid) },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              fontSize={13}
              textTransform="uppercase"
              fontWeight={500}
              color={colorPalette.typographyVariants.grey}>
              {item.label}:
            </Typography>
            <Typography fontSize={13}>{item.value}</Typography>
          </Box>
        ))}
      </Box>
      <Typography
        fontSize={13}
        textTransform="uppercase"
        color={colorPalette.typographyVariants.grey}>
        {orderItem.product?.returnInfo}
      </Typography>
    </Box>
  );
}
