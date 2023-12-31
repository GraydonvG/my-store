import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReactNode } from 'react';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type UserDataWithLabelProps = {
  label: string;
  children: ReactNode;
};

function UserDataWithLabel({ label, children }: UserDataWithLabelProps) {
  const customColorPalette = useCustomColorPalette();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 2 }}>
      <Typography
        component="label"
        fontSize={12}
        color={customColorPalette.textField.label}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

type EditableFieldProps = {
  show: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function EditableField({ show, label, onClick, children }: EditableFieldProps) {
  if (!show) return null;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        cursor: 'pointer',
        alignItems: 'center',
        paddingBottom: 2,
      }}>
      <UserDataWithLabel label={label}>{children}</UserDataWithLabel>
      <EditIcon />
    </Box>
  );
}

type NonEditableFieldProps = {
  show: boolean;
  label: string;
  children: ReactNode;
};

function NonEditableField({ show, label, children }: NonEditableFieldProps) {
  if (!show) return null;

  return <UserDataWithLabel label={label}>{children}</UserDataWithLabel>;
}

type EditableProps = {
  canEdit: true;
  onClick: () => void;
  label: string;
  children: ReactNode;
};

type NonEditableProps = {
  canEdit: false;
  onClick: null;
  label: string;
  children: ReactNode;
};

type AccountPageInfoProps = EditableProps | NonEditableProps;

export default function AccountPageInfo({ canEdit, label, onClick, children }: AccountPageInfoProps) {
  return (
    <>
      <EditableField
        show={canEdit}
        label={label}
        onClick={onClick!}>
        {children}
      </EditableField>
      <NonEditableField
        show={!canEdit}
        label={label}>
        {children}
      </NonEditableField>
    </>
  );
}
