import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ShoppingProductTile from "./product-tile";
import ProductDetailsDialog from "./product-details";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import notFound from "../../assets/404.json";
import loading from "../../assets/loading.json";
import among from "../../assets/among-us.json";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // 🔍 Debounced search
  useEffect(() => {
    let timer;
    if (keyword && keyword.trim().length > 3) {
      setIsSearching(true);
      timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => setIsSearching(false));
      }, 600); // debounce
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
      setIsSearching(false);
    }

    return () => clearTimeout(timer); // cleanup
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container font-[Rajdhani] mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <Input
          value={keyword}
          name="keyword"
          onChange={(event) => setKeyword(event.target.value)}
          className="py-6 !text-xl"
          placeholder="Search Products..."
        />
      </div>

      {/* Loading animation */}
      {isSearching && (
        <div className="flex flex-col items-center mt-20">
          <Lottie animationData={loading} loop autoplay style={{ height: 250 }} />
          {/* <h1 className="text-2xl font-bold">Searching...</h1> */}
        </div>
      )}

      {/* No results */}
      {!isSearching && keyword.length > 3 && searchResults.length === 0 && (
        <div className="flex flex-col items-center mt-20">
          <Lottie animationData={among} loop autoplay style={{ height: 250 }} />
          <h1 className="text-2xl font-bold">No Products Found</h1>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id}
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
