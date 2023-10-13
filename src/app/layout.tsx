import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { Container } from '@mui/material';
import AuthStateListener from '@/components/AuthStateListener';
import ModalComponent from '@/components/ui/Modal/ModalComponent';
import DrawerComponent from '@/components/ui/DrawerComponent';
import Navbar from '@/components/Navigation/Navbar/Navbar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import Toast from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'MyStore',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>
            <Container maxWidth="lg">{children}</Container>
          </main>
          <DrawerComponent />
          <ModalComponent />
          <AuthStateListener />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
