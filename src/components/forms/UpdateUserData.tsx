'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Typography } from '@mui/material';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsUpdateDialogOpen, setShowDialogLoadingBar } from '@/lib/redux/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update-user';

const formFields = [
  { label: 'First Name', name: 'firstName', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'lastName', autoComplete: 'family-name' },
];

const defaultFormData = {
  firstName: '',
  lastName: '',
};

export default function UpdateUserData() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const router = useRouter();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    dispatch(setShowDialogLoadingBar(true));

    const { firstName, lastName } = formData;

    try {
      const { success, message } = await updateUserPersonalInformation({ firstName, lastName, contactNumber: null });

      if (success) {
        dispatch(setIsUpdateDialogOpen(false));
        setFormData(defaultFormData);
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Update user failed. Please try again later.');
    } finally {
      setIsLoading(false);
      dispatch(setShowDialogLoadingBar(false));
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}>
      <FormTitle text="Welcome!" />
      <Typography
        component="p"
        variant="body1">
        Please provide the following details
      </Typography>
      <Box
        component="form"
        onSubmit={handleUpdate}>
        {formFields.map((field) => (
          <CustomTextField
            key={field.name}
            margin="normal"
            required={true}
            fullWidth={true}
            id={field.name}
            label={field.label}
            name={field.name}
            autoComplete={field.autoComplete}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            autoFocus={field.name === 'email'}
          />
        ))}
        <ContainedButton
          label="submit"
          isDisabled={isLoading}
          type="submit"
          styles={{ marginTop: 3 }}
          fullWidth
          backgroundColor="blue"
        />
      </Box>
    </Box>
  );
}
