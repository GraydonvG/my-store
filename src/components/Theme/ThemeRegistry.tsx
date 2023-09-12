'use client';

import { ReactNode, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { grey } from '@mui/material/colors';
import { useAppSelector } from '@/lib/redux/hooks';

const getDesignTokens = (mode: 'light' | 'dark') => ({
  components: {
    MuiToolbar: {
      styleOverrides: {
        regular: {
          minHeight: 'unset',
          '@media (min-width: 600px)': {
            minHeight: 'unset',
          },
        },
      },
    },
  },

  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          action: {
            // hover: 'green',
          },
          background: {
            // default: grey[200],
            // paper: grey[200],
          },
          navbarUpper: {
            background: '#2e3131',
            text: '#ffffff',
            icon: '#ffffff',
            iconHover: grey[800],
          },
          navbarLower: {
            background: '#f2f2f2',
            text: grey[700],
            icon: grey[700],
            menuItemHover: grey[800],
            menuItemText: '#ffffff',
          },
          navDrawer: {
            headerBackground: '#2e3131',
            headerText: '#ffffff',
            bodyBackground: '#ffffff',
            bodyText: grey[700],
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: grey[700],
            paper: grey[900],
          },
          navbarUpper: {
            background: grey[900],
            text: '#ffffff',
            icon: '#ffffff',
          },
          navbarLower: {
            background: grey[800],
            text: '#ffffff',
            icon: '#ffffff',
            menuItemHover: grey[800],
            menuItemText: '#ffffff',
          },
          navDrawer: {
            headerBackground: grey[900],
            headerText: '#ffffff',
            bodyBackground: grey[700],
            bodyText: '#ffffff',
          },
        }),
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}