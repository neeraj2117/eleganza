import { API_URL } from "@/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null
};

// Fetch All Filtered Products
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/get",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams();

    Object.entries(filterParams).forEach(([key, values]) => {
      if (values?.length) {
        query.append(key.toLowerCase(), values.join(",")); 
      }
    });

    // Add sort
    if (sortParams) {
      query.append("sortBy", sortParams);
    }

    const result = await axios.get(
      `${API_URL}/api/shop/products/get?${query.toString()}`
    );

    return result?.data;
  }
);

// Fetch Product Details
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${API_URL}/api/shop/products/get/${id}`
    );
    return result?.data;
  }
);


const shoppingProductSlice = createSlice({
  name: "shoppingProduct",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.error.message;
      });
  },
});

export const {setProductDetails} = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
