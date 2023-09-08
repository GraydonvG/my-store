'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import AccountMenu from './AccountMenu';
import DrawerComponent from './Drawer';
import NavbarOptions from './NavbarOptions';
import DrawerNavContent from './DrawerNavContent';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ShoppingBasket, Menu, ShoppingCart } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { CurrentUserType, DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import ModalComponent from './Modal';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { useEffect } from 'react';
import { onAuthStateChangedListener } from '@/lib/firebase';
import { setCurrentUser } from '@/lib/redux/user/userSlice';

const isAdminView = false;
const isAuthUser = false;
const user = {
  // role: 'admin',
  role: 'customer',
};

export default function Navbar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isBelowMedium = useMediaQuery(theme.breakpoints.up('md'));
  const currenUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    isBelowMedium ? dispatch(setIsDrawerOpen({ left: false })) : null;
  }, [isBelowMedium]);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      // if (user) {
      //   createUserDocumentFromAuth();
      // }

      const selectedUserDetails =
        user && (({ uid, displayName, email, photoURL }) => ({ uid, displayName, email, photoURL }))(user);
      dispatch(setCurrentUser(selectedUserDetails as CurrentUserType));
    });
    return unsubscribe;
  }, []);

  function changeTheme() {
    dispatch(toggleTheme());
  }

  function openDrawer(anchor: DrawerAnchor) {
    dispatch(setIsDrawerOpen({ [anchor]: true }));
  }

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

  return (
    <>
      <AppBar
        sx={{ backgroundColor: 'navbar.background' }}
        elevation={0}
        position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <ShoppingBasket sx={{ mr: 1, color: 'navbar.icon' }} />
              <Typography
                tabIndex={-1}
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'navbar.text',
                  textDecoration: 'none',
                }}>
                MyStore
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                sx={{ color: 'navbar.icon' }}
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => openDrawer('left')}>
                <Menu />
              </IconButton>
            </Box>
            <Box
              sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
              <ShoppingBasket sx={{ marginRight: 1, color: 'navbar.icon' }} />
              <Typography
                tabIndex={-1}
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'navbar.text',
                  textDecoration: 'none',
                }}>
                MyStore
              </Typography>
            </Box>
            <Box
              sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
              <NavbarOptions user={user} />
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: 0, md: 2 }, alignItems: 'center' }}>
              {currenUser ? (
                <>
                  {user?.role !== 'admin' ? (
                    <Tooltip
                      title="Shopping cart"
                      arrow
                      PopperProps={{
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, 5],
                            },
                          },
                        ],
                      }}>
                      <IconButton
                        size="large"
                        sx={{ color: 'navbar.icon' }}>
                        <ShoppingCart aria-label="Shopping cart" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  <AccountMenu
                    userRole={user}
                    isAdminView={isAdminView}
                  />
                </>
              ) : (
                <>
                  {mode === 'dark' ? (
                    <IconButton
                      onClick={changeTheme}
                      size="large"
                      sx={{ color: 'navbar.icon' }}>
                      <Brightness7Icon fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={changeTheme}
                      size="large"
                      sx={{ color: 'navbar.icon' }}>
                      <Brightness4Icon fontSize="small" />
                    </IconButton>
                  )}
                  <Button
                    onClick={() => handleModal('signIn')}
                    sx={{
                      my: 2,
                      color: 'navbar.text',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      '&:hover': { backgroundColor: 'inherit' },
                    }}>
                    Sign In
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <ModalComponent />
      <DrawerComponent>
        <DrawerNavContent userRole={user} />
      </DrawerComponent>
    </>
  );
}
