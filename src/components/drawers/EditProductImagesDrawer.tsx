import DrawerComponent from './DrawerComponent';
import { DeleteForever, Edit } from '@mui/icons-material';
import ContainedButton from '../ui/buttons/ContainedButton';
import useColorPalette from '@/hooks/useColorPalette';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box, useTheme } from '@mui/material';
import OutlinedButton from '../ui/buttons/OutlinedButton';
import DrawerHeader from './DrawerHeader';
import { clearImageData } from '@/lib/redux/slices/productImagesSlice';
import DraggableProductImages from '../draggableProductImages/DraggableProductImages';

type Props = {
  isSubmitting: boolean;
};

export default function EditProductImagesDrawer({ isSubmitting }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const [isDeletingAllImages, setIsDeletingAllImages] = useState(false);
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress, isDeletingImage } = useAppSelector((state) => state.productImages);
  const uploadInProgress = imageUploadProgress.some((upload) => upload.progress < 100);
  const [isEditImagesDrawerOpen, setIsEditImagesDrawerOpen] = useState(false);

  function openEditImageDrawer() {
    setIsEditImagesDrawerOpen(true);
  }

  function closeEditImageDrawer() {
    if (isDeletingAllImages || isDeletingImage) return;
    setIsEditImagesDrawerOpen(false);
  }

  async function deleteAllImages() {
    setIsDeletingAllImages(true);

    await deleteAllProductImages(imageData, productFormData.productId);

    dispatch(clearImageData());
    setIsDeletingAllImages(false);
    setIsEditImagesDrawerOpen(false);
  }

  return (
    <>
      <OutlinedButton
        isDisabled={uploadInProgress || isSubmitting || imageData.length === 0}
        onClick={openEditImageDrawer}
        fullWidth
        label={'edit'}
        startIcon={<Edit />}
      />
      <DrawerComponent
        elevation={1}
        width={{ xs: '100vw', sm: '350px' }}
        isOpen={{ right: isEditImagesDrawerOpen }}
        zIndex={theme.zIndex.appBar + 1}
        closeDrawer={closeEditImageDrawer}>
        <DrawerHeader
          label="Edit images"
          onClick={closeEditImageDrawer}
        />
        <DraggableProductImages isDeletingAllImages={isDeletingAllImages} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            padding: 2,
            gap: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              boxShadow: `0 -2px 4px 0 ${colorPalette.boxShadow}`,
              top: 0,
              right: 0,
              left: 0,
              height: '4px',
            },
          }}>
          <ContainedButton
            onClick={deleteAllImages}
            disabled={isDeletingAllImages}
            isLoading={isDeletingAllImages}
            label={isDeletingAllImages ? '' : 'Delete all'}
            backgroundColor="warning"
            fullWidth
            startIcon={<DeleteForever />}
          />
        </Box>
      </DrawerComponent>
    </>
  );
}
