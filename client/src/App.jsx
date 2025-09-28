import './App.css'
import { Route, Routes } from 'react-router-dom';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminFeatures from './pages/admin-view/features';
import AdminOrders from './pages/admin-view/orders';
import AdminProducts from './pages/admin-view/products';
import AdminLayout from './components/admin-view/layout';
import ShoppingLayout from './pages/shopping-view/layout';
import NotFound from './pages/not-found';
import ShoppingHome from './pages/shopping-view/home';
import ShoppingListing from './pages/shopping-view/listing';
import ShoppingCheckout from './pages/shopping-view/checkout';
import ShoppingAccount from './pages/shopping-view/account';
import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth_slice';
import { useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from './pages/shopping-view/paypal-return';
import PaymentSuccessPage from './pages/shopping-view/payment-success';
import GlobalLoader from './components/common/global-loader';
import ShoppingSearchPage from './pages/shopping-view/search-page';

function App() {
  const {isAuthenticated, user, isLoading} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <GlobalLoader />;

  // if (isLoading) return <Skeleton className="h-[20px] w-[100px] rounded-full" />
  

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        <Route
          path='/'
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
          }
        />
        {/* authentication routes */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin/>}/>
          <Route path="register" element={<AuthRegister/>}/>
        </Route>

        {/* admin routes */}
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard/>}/>
          <Route path="features" element={<AdminFeatures/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="products" element={<AdminProducts/>}/>
        </Route>

        {/* shopping routes */}
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout/>
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome/>}/>
          <Route path="listing" element={<ShoppingListing/>}/>
          <Route path="checkout" element={<ShoppingCheckout/>}/>
          <Route path="account" element={<ShoppingAccount/>}/>
          <Route path="paypal-return" element={<PaypalReturnPage/>}/>
          <Route path="payment-success" element={<PaymentSuccessPage/>}/>
          <Route path="search" element={<ShoppingSearchPage/>}/>
        </Route>

        {/* unknown found path/pages */}
        <Route path="/unauth-page" element={<UnauthPage/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>

    </div>
  );
}

export default App
