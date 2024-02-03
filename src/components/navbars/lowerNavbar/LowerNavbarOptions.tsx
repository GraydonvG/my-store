import { ACCOUNT_NAV_OPTIONS, ADMIN_NAV_OPTIONS, NAV_OPTIONS } from '@/config';
import LowerNavbarOption from './LowerNavbarOption';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function LowerNavbarOptions() {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const isAccountView = pathname.includes('/account') || pathname.includes('/orders') || pathname.includes('/wishlist');

  return (
    <Box
      component="nav"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <List
        disablePadding
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isAdminView && !isAccountView
          ? NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null}

        {isAdminView
          ? ADMIN_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = ADMIN_NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null}

        {isAccountView
          ? ACCOUNT_NAV_OPTIONS.map((option, index) => {
              const isLastNavOption = ACCOUNT_NAV_OPTIONS.length - 1 === index;

              return (
                <LowerNavbarOption
                  key={option.id}
                  label={option.label}
                  path={option.path}
                  isLastNavOption={isLastNavOption}
                  underline={option.path === pathname}
                />
              );
            })
          : null}
      </List>
    </Box>
  );
}
