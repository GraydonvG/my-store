import Link from 'next/link';
import { ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsDrawerOpen } from '@/lib/redux/drawer/drawerSlice';

type NavDrawerNavOptionProps = {
  path: string;
  label: string;
};

export default function NavDrawerNavOption({ path, label }: NavDrawerNavOptionProps) {
  const dispatch = useAppDispatch();

  function closeDrawer() {
    dispatch(setIsDrawerOpen({ left: false }));
  }

  return (
    <>
      <Link
        tabIndex={-1}
        href={path}>
        <ListItem
          disablePadding
          onClick={closeDrawer}>
          <ListItemButton disableGutters>
            <ListItemText
              primary={label}
              sx={{ color: 'navDrawer.bodyText', marginLeft: 1 }}
            />
            <ArrowForwardIosIcon sx={{ marginRight: 2, color: 'navDrawer.bodyText' }} />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
    </>
  );
}