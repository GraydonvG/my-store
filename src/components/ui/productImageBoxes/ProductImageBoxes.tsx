import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import SmallProductImageBox from './SmallProductImageBox';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';

type Props = { isEditMode?: boolean; product?: ProductType };

export default function ProductImageBoxes({ isEditMode, product }: Props) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { imageData, formData } = useAppSelector((state) => state.addProduct);
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;
  const boxBorderColor = isAdminView ? borderColor : 'transparent';

  useEffect(() => {
    if (isAdminView && imageData.length === 0) {
      setSelectedImageIndex(0);
    }
  }, [isAdminView, imageData]);

  function handleSelectedImage(index: number) {
    if (isAdminView && index > imageData.length - 1) return;
    setSelectedImageIndex(index);
  }

  function getImageBoxes() {
    const imageBoxes = [];

    for (let index = 0; index < 5; index++) {
      const data = product?.product_image_data?.find((item) => item.index === index);

      imageBoxes.push(
        <SmallProductImageBox
          key={index}
          productName={product?.name ?? ''}
          productImageData={data || null}
          imageIndex={index}
          borderColor={boxBorderColor}
          isEditMode={isEditMode}
          selectImage={() => handleSelectedImage(index)}
          selectedImageIndex={selectedImageIndex}
        />
      );
    }
    return imageBoxes;
  }

  return (
    <Grid
      container
      spacing={1}
      sx={{ maxWidth: isAdminView ? '500px' : null }}>
      <Grid
        item
        xs={12}
        sm={2}
        sx={{ order: { xs: 2, sm: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: { xs: 1, sm: `10.7px` },
          }}>
          {isAdminView
            ? Array.from(Array(5)).map((_, index) => (
                <SmallProductImageBox
                  key={index}
                  productName={formData.name}
                  productImageData={imageData[index]}
                  imageIndex={index}
                  borderColor={boxBorderColor}
                  isEditMode={isEditMode}
                  selectImage={() => handleSelectedImage(index)}
                  selectedImageIndex={selectedImageIndex}
                />
              ))
            : getImageBoxes()}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={10}
        sx={{ order: { xs: 1, sm: 2 } }}>
        {isAdminView && imageData.length > 0 ? (
          <LargeProductImageBox
            productName={formData.name}
            productImageData={imageData[selectedImageIndex]}
            selectedImageIndex={selectedImageIndex}
            borderColor={boxBorderColor}
          />
        ) : (
          <LargeProductImageBox
            productName={product?.name ?? ''}
            productImageData={product?.product_image_data[selectedImageIndex]}
            selectedImageIndex={selectedImageIndex}
            borderColor={boxBorderColor}
          />
        )}
      </Grid>
    </Grid>
  );
}
