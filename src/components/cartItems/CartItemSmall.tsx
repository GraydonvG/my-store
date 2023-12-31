'use client';

import { Box, IconButton, ListItem, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { Spinner } from '../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import { CartItemType } from '@/types';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import deleteItemFromCart from '@/services/cart/delete-item-from-cart';
import { useState } from 'react';
import { selectDiscountedPrice, selectPrice } from '@/lib/redux/cart/cartSelectors';
import { formatCurrency } from '@/utils/formatCurrency';
import { borderRadius } from '@/constants/styles';

type LoadingSpinnerProps = {
  show: boolean;
};

function LoadingSpinner({ show }: LoadingSpinnerProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
      <Spinner
        thickness={5}
        size={12}
        spinnerColor={customColorPalette.typographyVariants.grey}
      />
    </Box>
  );
}

type DeleteCartItemButtonProps = {
  show: boolean;
  disabled: boolean;
  onClick: () => void;
};

function DeleteCartItemButton({ show, disabled, onClick }: DeleteCartItemButtonProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      sx={{ padding: 0, width: 1, height: 1 }}>
      <Close
        fontSize="small"
        sx={{ color: customColorPalette.typographyVariants.grey }}
      />
    </IconButton>
  );
}

type CartItemButtonsProps = {
  showButtons: boolean;
  showSpinner: boolean;
  showDeleteButton: boolean;
  disabled: boolean;
  onClick: () => void;
};

function CartItemButtons({ showButtons, showSpinner, showDeleteButton, disabled, onClick }: CartItemButtonsProps) {
  if (!showButtons) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'grid',
        placeItems: 'center',
        width: '20px',
        height: '20px',
      }}>
      <LoadingSpinner show={showSpinner} />
      <DeleteCartItemButton
        show={showDeleteButton}
        disabled={disabled}
        onClick={onClick}
      />
    </Box>
  );
}

type SalePercentageBadgeProps = {
  show: boolean;
  percentage: number;
};

function SalePercentageBadge({ show, percentage }: SalePercentageBadgeProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: borderRadius,
        paddingX: 1,
        backgroundColor: customColorPalette.primary.dark,
        width: 'fit-content',
        height: 'fit-content',
      }}>
      <Typography
        lineHeight={1.6}
        component="span"
        sx={{
          color: customColorPalette.typographyVariants.white,
        }}
        fontSize={14}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}

type SalePriceProps = {
  show: boolean;
  price: number;
};

function SalePrice({ show, price }: SalePriceProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
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
        color={customColorPalette.typographyVariants.grey}
        sx={{ textDecoration: 'line-through' }}>
        {formatCurrency(price)}
      </Typography>
    </Box>
  );
}

type CartItemSmallProps = {
  item: CartItemType;
};

export default function CartItemSmall({ item }: CartItemSmallProps) {
  const customColorPalette = useCustomColorPalette();
  const pathname = usePathname();
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const router = useRouter();
  const isOnSale = item?.product?.isOnSale === 'Yes';
  const price = selectPrice(item);
  const discountedPrice = selectDiscountedPrice(item);
  const isShippingView = pathname.includes('/checkout/shipping');

  async function handleRemoveCartItem(cartItemId: string) {
    setIsRemovingCartItem(true);
    try {
      const { success, message } = await deleteItemFromCart(cartItemId);
      if (success === true) {
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(`Failed to remove product from cart. Please try again later.`);
    } finally {
      setIsRemovingCartItem(false);
    }
  }

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        opacity: isRemovingCartItem ? '70%' : null,
        paddingY: 2,
      }}>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          aspectRatio: 3 / 4,
          width: '60px',
          flexShrink: 0,
        }}>
        <Image
          style={{ objectFit: 'cover', borderRadius: borderRadius }}
          fill
          sizes="60px"
          src={item?.product?.productImageData[0].imageUrl ?? ''}
          alt={`${item?.product?.name}`}
          priority
        />
      </Box>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexGrow: 1,
          height: 1,
        }}>
        <CartItemButtons
          showButtons={!isShippingView}
          showSpinner={isRemovingCartItem}
          showDeleteButton={!isRemovingCartItem}
          disabled={isRemovingCartItem}
          onClick={() => handleRemoveCartItem(item?.cartItemId!)}
        />
        <Box
          component="header"
          sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
          <Typography
            lineHeight={1}
            component="h4"
            fontWeight={600}
            fontSize={15}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              paddingRight: 3,
            }}>
            {item?.product?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[
              { label: 'QTY', value: item?.quantity },
              { label: 'Size', value: item?.size },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontSize={13}
                  color={customColorPalette.typographyVariants.grey}>
                  {item.label}:
                </Typography>
                <Typography
                  lineHeight={1}
                  component="span"
                  fontWeight={600}
                  fontSize={13}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          component="footer"
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: 1 }}>
          <SalePercentageBadge
            show={isOnSale}
            percentage={item?.product?.salePercentage!}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              width: 1,
            }}>
            <SalePrice
              show={isOnSale}
              price={price}
            />
            <Typography
              lineHeight={1}
              component="span"
              variant="h6"
              fontSize={16}
              fontWeight={700}>
              {formatCurrency(isOnSale ? discountedPrice : price)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}
