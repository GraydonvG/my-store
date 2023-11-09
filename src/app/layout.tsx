import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Container } from '@mui/material';
import ModalComponent from '@/components/ui/ModalComponent';
import DrawerComponent from '@/components/ui/DrawerComponent';
import Navbar from '@/components/navigation/navbar/Navbar';
import Toast from '@/components/ui/Toast';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import { CurrentUserType } from '@/types';
import UserStateSetter from '@/components/UserStateSetter';
import serverClient from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'MyStore',
  description: 'Generated by create next app',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = await serverClient();
  const { data: user } = await supabase.from('users').select('*');
  const userData = user ? user[0] : ({} as CurrentUserType);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>
            <Container
              sx={{ paddingX: { xs: 0.3, sm: 2 }, paddingY: 2 }}
              disableGutters
              maxWidth="lg">
              {children}
            </Container>
          </main>
          <DrawerComponent />
          <ModalComponent />
          <Toast />
          <UserStateSetter userData={userData} />
        </Providers>
      </body>
    </html>
  );
}
