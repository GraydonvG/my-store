import { Box, IconButton, useTheme } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import DrawerComponent from '../DrawerComponent';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { CartItemType } from '@/types';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { updateCartItemQuantity, updateCartItemSize } from '@/services/cart/update';
import { deleteItemFromCart } from '@/services/cart/delete';
import SizePickerEditCartItemDrawer from './SizePickerEditCartItemDrawer';
import BottomEditCartItemDrawer from './BottomEditCartItemDrawer';
import LoaderEditCartItemDrawer from './LoaderEditCartItemDrawer';
import { setCartItemQuantityWillUpdate } from '@/lib/redux/slices/cartSlice';

type Props = {
  cartItem: CartItemType;
};

export default function EditCartItemDrawer({ cartItem }: Props) {
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const router = useRouter();
  const theme = useTheme();
  const { cartItems, cartItemQuantityWillUpdate } = useAppSelector((state) => state.cart);
  const [cartItemToEditId, setCartItemToEditId] = useState<string | null>(null);
  const [isUpdatingCartItemQuantity, setIsUpdatingCartItemQuantity] = useState(false);
  const [isUpdatingCartItemSize, setIsUpdatingCartItemSize] = useState(false);
  const [isRemovingCartItem, setIsRemovingCartItem] = useState(false);
  const isUpdatingCartItem = isRemovingCartItem || isUpdatingCartItemQuantity || isUpdatingCartItemSize;

  useEffect(() => {
    setIsUpdatingCartItemSize(false);
  }, [dispatch, cartItem?.size]);

  useEffect(() => {
    setIsRemovingCartItem(false);
  }, [cartItem]);

  function openDrawer(id: string | null) {
    setCartItemToEditId(id);
  }

  function closeDrawer() {
    if (isUpdatingCartItem || cartItemQuantityWillUpdate) return;
    setCartItemToEditId(null);
  }

  async function updateItemQuantity(cartItemId: string, newQuantity: number) {
    setIsUpdatingCartItemQuantity(true);
    dispatch(setCartItemQuantityWillUpdate(false));

    const { success, message } = await updateCartItemQuantity({
      cartItemId: cartItemId,
      quantity: newQuantity,
    });

    if (success === false) {
      toast.error(message);
    }

    router.refresh();
    setIsUpdatingCartItemQuantity(false);
  }

  async function updateItemSize(size: string) {
    // If an item with the selected size already exists, update the quantity of that item appropriately and remove the old item. Else, update the size.

    if (size === cartItem?.size) return;

    setIsUpdatingCartItemSize(true);

    const itemOfSelectedSizeExists = cartItems.find(
      (item) =>
        item?.product?.productId === cartItem?.product?.productId &&
        item?.size === size &&
        item.cartItemId !== cartItem?.cartItemId
    );

    if (itemOfSelectedSizeExists) {
      const newQuantity = itemOfSelectedSizeExists.quantity + cartItem?.quantity!;

      await updateItemQuantity(itemOfSelectedSizeExists.cartItemId, newQuantity);

      await removeCartItem();
    } else {
      const { success, message } = await updateCartItemSize({
        cartItemId: cartItem?.cartItemId!,
        size,
      });

      if (success === true) {
        router.refresh();
      } else {
        setIsUpdatingCartItemSize(false);
        toast.error(message);
      }
    }
  }

  async function removeCartItem() {
    setIsRemovingCartItem(true);

    const { success, message } = await deleteItemFromCart(cartItem?.cartItemId!);

    if (success === true) {
      router.refresh();
    } else {
      setIsRemovingCartItem(false);
      toast.error(message);
    }
  }

  return (
    <>
      <IconButton onClick={() => openDrawer(cartItem?.cartItemId)}>
        <Edit
          fontSize="small"
          sx={{ color: colorPalette.typographyVariants.grey }}
        />
      </IconButton>
      <DrawerComponent
        elevation={1}
        width={{ xs: '80vw', sm: '350px' }}
        isOpen={{
          right: cartItemToEditId === cartItem?.cartItemId,
        }}
        zIndex={theme.zIndex.appBar + 1}
        closeDrawer={closeDrawer}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          {isUpdatingCartItem ? <LoaderEditCartItemDrawer isUpdatingCartItem={isUpdatingCartItem} /> : null}

          <SizePickerEditCartItemDrawer
            cartItem={cartItem}
            isUpdatingCartItem={isUpdatingCartItem}
            setCartItemSizeOnClick={updateItemSize}
          />
          <BottomEditCartItemDrawer
            cartItem={cartItem}
            isUpdatingCartItem={isUpdatingCartItem}
            isRemovingCartItem={isRemovingCartItem}
            updateCartItemQuantity={updateItemQuantity}
            removeCartItemOnClick={removeCartItem}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
