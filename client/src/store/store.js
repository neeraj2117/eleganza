import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth_slice';
import adminProductsSlice from './admin/product_slice';
import adminOrderSlice from './admin/order_slice';

import shoppingProductReducer from './shop/products-slice';
import shopCartSlice from './shop/cart-slice';
import shopAddressSlice from './shop/address-slice.js';
import shopOrderSlice from './shop/order-slice';
import shopSearchSlice from './shop/search-slice';
import shopReviewSlice from './shop/review-slice';

import commonFeatureSlice from './common-slice';

const store = configureStore({
    reducer : {
        auth: authReducer,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,

        shopProducts: shoppingProductReducer,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,

        commonFeature: commonFeatureSlice
    }
});

export default store;
