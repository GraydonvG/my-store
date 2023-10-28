import { AddProductStoreType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isDeletingImage: false,
  formData: {
    category: '',
    delivery_info: '',
    description: '',
    name: '',
    on_sale: '',
    price: '',
    sale_percentage: '',
    sizes: [],
  } as AddProductStoreType,
};

export const addProductSlice = createSlice({
  name: 'addProduct',
  initialState,
  reducers: {
    setFormData(
      state,
      action: PayloadAction<{
        field: keyof AddProductStoreType;
        value: any;
      }>
    ) {
      const { field, value } = action.payload;
      if (field === 'price' || field === 'sale_percentage') {
        const number = Number(value);
        state.formData = { ...state.formData, [field]: number };
      } else if (field === 'sizes') {
        if (state.formData.sizes.includes(value)) {
          const filteredSizes = state.formData.sizes.filter((size) => size !== value);
          state.formData.sizes = filteredSizes;
        } else {
          state.formData.sizes = [...state.formData.sizes, value];
        }
      } else {
        state.formData = { ...state.formData, [field]: value };
      }
    },
    // deleteImage(state, action: PayloadAction<{ fileName: string }>) {
    //   state.formData.imageData = state.formData.imageData.filter(
    //     (data) => data.fileName !== action.payload.fileName
    //   ) as { imageUrl: string; fileName: string }[];
    // },
    setIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.isDeletingImage = action.payload;
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
  },
});

const { actions, reducer } = addProductSlice;

export const { setFormData, setIsDeletingImage, resetFormData } = actions;

export const userReducer = reducer;
