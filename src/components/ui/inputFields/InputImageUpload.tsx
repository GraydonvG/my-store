'use client';

import { Check, CloudUpload, Edit } from '@mui/icons-material';
import CustomButton from '../buttons/CustomButton';
import { Input, InputProps } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Spinner } from '../progress/Spinner';
import ProductImageBoxes from '../ProductImageBoxes';
import { useEffect, useState } from 'react';

type InputImageUploadProps = InputProps & {
  isLoading: boolean;
};

export default function InputImageUpload({ isLoading, ...inputProps }: InputImageUploadProps) {
  const formData = useAppSelector((state) => state.addNewProductFormData.formData);
  const isDeletingImage = useAppSelector((state) => state.addNewProductFormData.isDeletingImage);
  const [isEditMode, setIsEditMode] = useState(false);
  const color = useCustomColorPalette();
  const containsUploadProgress = formData.imageData.some((obj) => 'uploadProgress' in obj);

  useEffect(() => {
    if (formData.imageData.length === 0) {
      setIsEditMode(false);
    }
  }, [formData.imageData]);

  function handleToggleEditMode() {
    setIsEditMode((previousMode) => !previousMode);
  }

  return (
    <>
      <ProductImageBoxes isEditMode={isEditMode} />
      <CustomButton
        disabled={isDeletingImage || containsUploadProgress || formData.imageData.length === 0}
        onClick={() => handleToggleEditMode()}
        fullWidth={true}
        label={isEditMode ? 'done' : 'edit'}
        styles={{
          backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
          '&:hover': {
            backgroundColor: isEditMode ? color.green.dark : color.grey.medium,
            filter: 'brightness(1.2)',
            transition: 'filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          },
        }}
        startIcon={
          isEditMode ? (
            isDeletingImage ? (
              <Spinner
                providedColor="white"
                size={20}
              />
            ) : (
              <Check />
            )
          ) : (
            <Edit />
          )
        }
      />
      <CustomButton
        disabled={isLoading}
        styles={{
          backgroundColor: color.blue.dark,
          '&:hover': { backgroundColor: color.blue.light },
        }}
        label={
          <>
            {isLoading ? 'uploading...' : 'upload images'}
            <Input
              inputProps={{ accept: 'image/*', multiple: true }}
              type="file"
              sx={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              {...inputProps}
            />
          </>
        }
        startIcon={isLoading ? <Spinner size={20} /> : <CloudUpload />}
        fullWidth={true}
        component="label"
      />
    </>
  );
}
