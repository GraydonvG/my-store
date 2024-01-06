import { setCheckoutData } from '@/lib/redux/checkoutData/checkoutDataSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import payWithStripe from '@/utils/payWithStripe';
import { toast } from 'react-toastify';
import BreadcrumbItem from '../breadcrumbs/BreadcrumbItem';
import { Payment } from '@mui/icons-material';
import ContainedButton from './ContainedButton';
import addOrder from '@/services/orders/add';
import addOrderItems from '@/services/orders/order-items/add';

type Props = {
  showContainedButton?: boolean;
  showBreadcrumbButton?: boolean;
};

export default function PaymentButton({ showBreadcrumbButton = false, showContainedButton = false }: Props) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const checkoutData = useAppSelector((state) => state.checkoutData);

  async function handleCreateOrder() {
    const { success, message, data } = await addOrder({
      user_id: checkoutData.userId!,
      shipping_details: checkoutData.shippingDetails!,
      cart_total: checkoutData.paymentTotals.cartTotal,
      delivery_fee: checkoutData.paymentTotals.deliveryFee,
      discount_total: checkoutData.paymentTotals.totalDiscount,
      order_total: checkoutData.paymentTotals.orderTotal,
    });

    if (success === true && !!data) {
      const createOrderItems = checkoutData.orderItems.map((item) => {
        return {
          ...item,
          order_id: data.order_id,
          user_id: checkoutData.userId!,
        };
      });

      const { success, message } = await addOrderItems(createOrderItems);

      if (success === true) {
        dispatch(setCheckoutData({ orderId: data.order_id }));
        return { success: true, message };
      } else {
        toast.error(message);
        return { success: false, message };
      }
    } else {
      toast.error(message);
      return { success: false, message };
    }
  }

  async function handlePayWithStripe() {
    dispatch(setCheckoutData({ isProcessing: true }));

    const { success, message } = await handleCreateOrder();

    if (success === false) {
      return toast.error(message);
    }

    const error = await payWithStripe(cartItems);

    if (error?.success === false) {
      dispatch(setCheckoutData({ isProcessing: false }));
      toast.error(error.message);
    }
  }

  if (showContainedButton)
    return (
      <ContainedButton
        disabled={!checkoutData.shippingDetails}
        onClick={handlePayWithStripe}
        label={!checkoutData.isProcessing ? 'continue to payment' : ''}
        fullWidth
        backgroundColor={'red'}
        isLoading={checkoutData.isProcessing}
      />
    );

  if (showBreadcrumbButton)
    return (
      <BreadcrumbItem
        href=""
        icon={<Payment />}
        label="payment"
        onLinkClick={!!checkoutData.shippingDetails ? handlePayWithStripe : undefined}
      />
    );
}