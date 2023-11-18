import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Container } from '@mui/material';
import Navbar from '@/components/navigation/navbar/Navbar';
import Toast from '@/components/ui/Toast';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { CartItemType, CurrentUserType } from '@/types';
import UserStateSetter from '@/components/UserStateSetter';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import CartItemsStateSetter from '@/components/CartItemsStateSetter';

export const metadata: Metadata = {
  title: 'MyStore',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: user } = await supabase.from('users').select('*');
  const userData = user ? user[0] : ({} as CurrentUserType);
  let cartItems = [] as CartItemType[];

  if (user) {
    const { data: cart } = await supabase
      .from('cart')
      .select(
        'created_at, cart_item_id, quantity, size,product: products!inner(name, on_sale, price, sale_percentage, delivery_info, product_id, product_image_data!inner(image_url))'
      )
      // .eq('products.product_image_data.index', 0)
      .order('created_at', { ascending: false });

    cartItems = cart ? cart : ([] as CartItemType[]);
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <UserStateSetter userData={userData} />
          <CartItemsStateSetter cartItems={cartItems} />
          <Navbar />
          <main>
            <Container
              sx={{
                paddingX: { xs: 0.3, sm: 2 },
                paddingTop: { xs: 0.3, sm: 2 },
                paddingBottom: 2,
              }}
              disableGutters
              maxWidth="lg">
              {children}
            </Container>
          </main>
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
