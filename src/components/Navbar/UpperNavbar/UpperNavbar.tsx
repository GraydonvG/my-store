'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';
import { Box, Toolbar, IconButton, useTheme, Divider } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { DrawerAnchor } from '@/types';
import { toggleTheme } from '@/lib/redux/theme/themeSlice';
import AccountMenu from '../../AccountMenu';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../../ui/CustomButton';
import NavbarTitleAndLogo from '../NavbarTitleAndLogo';
import NavbarContainer from '../NavbarContainer';
import ShoppingCart from './ShoppingCart';
import { ThemeIcon } from '@/components/ui/ThemeIcon';

const iconButtonStyles = {
  color: 'upperNavbar.primaryIcon',
  '&:hover': { backgroundColor: 'upperNavbar.background' },
};

export default function UpperNavbar() {
  const dispatch = useAppDispatch();
  const currenUser = useAppSelector((state) => state.user.currentUser);
  const theme = useTheme();
  const mode = theme.palette.mode;

  function handleModal(content: string) {
    dispatch(setModalContent(content));
    dispatch(setIsModalOpen(true));
  }

  function openDrawer(anchor: DrawerAnchor) {
    dispatch(setIsDrawerOpen({ [anchor]: true }));
  }

  function changeTheme() {
    dispatch(toggleTheme());
  }

  return (
    <NavbarContainer backgroundColor="upperNavbar.background">
      <Toolbar
        disableGutters
        sx={{
          justifyContent: { xs: 'space-between', md: 'flex-end' },
          height: { xs: '64px', md: '42px' },
        }}>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            sx={iconButtonStyles}
            size="small"
            aria-label="open navigation drawer"
            onClick={() => openDrawer('left')}>
            <Menu />
          </IconButton>
        </Box>
        <NavbarTitleAndLogo
          variant="h5"
          display={{ xs: 'flex', md: 'none' }}
          color="upperNavbar.text"
        />
        <Box
          component="nav"
          sx={{ display: 'flex', height: 1 }}>
          {currenUser ? (
            <>
              <Divider
                orientation="vertical"
                flexItem
              />
              <ShoppingCart />
              <Divider
                orientation="vertical"
                flexItem
              />
              <AccountMenu />
              <Divider
                orientation="vertical"
                flexItem
              />
            </>
          ) : (
            <>
              <IconButton
                onClick={changeTheme}
                size="small"
                sx={iconButtonStyles}>
                <ThemeIcon
                  size="small"
                  color="upperNavbar.primaryIcon"
                />
              </IconButton>
              <CustomButton
                onClick={() => handleModal('signIn')}
                textColor="upperNavbar.text"
                hoverBackgroundColor="upperNavbar.background">
                Sign in
              </CustomButton>
            </>
          )}
        </Box>
      </Toolbar>
    </NavbarContainer>
  );
}