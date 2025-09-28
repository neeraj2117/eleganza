import { Button } from "@/components/ui/button";
import banner1 from "../../assets/banner-1.webp";
import banner2 from "../../assets/banner-2.webp";
import banner3 from "../../assets/banner-3.webp";
import {
  BabyIcon,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Loader2 } from "lucide-react";
import ProductDetailsDialog from "./product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: ShirtIcon },
  { id: "adidas", label: "Adidas", icon: ShirtIcon },
  { id: "puma", label: "Puma", icon: ShirtIcon },
  { id: "levi", label: "Levi's", icon: ShirtIcon },
  { id: "zara", label: "Zara", icon: ShirtIcon },
  { id: "h&m", label: "H&M", icon: ShirtIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [banner1, banner2, banner3];
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [addingToCartId, setAddingToCartId] = useState(null);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilters = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate("/shop/listing");
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    setAddingToCartId(getCurrentProductId);
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      setTimeout(() => {
        setAddingToCartId(null);

        if (data?.payload?.success) {
          toast.success("Product added to Cart!");
          dispatch(fetchCartItems(user?.id));
        }
      }, 800);
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);
 
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[700px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}

        {/* Prev Button */}
        <Button
          variant="ghost"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-6 -translate-y-1/2 
             w-12 h-12 rounded-full bg-white/80 shadow-lg 
             hover:bg-white hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-12 h-12 text-gray-800" />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-6 -translate-y-1/2 
             w-12 h-12 rounded-full bg-white/80 shadow-lg 
             hover:bg-white hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronRightIcon className="w-12 h-12 text-gray-800" />
        </Button>
      </div>

      {/* shop by category */}
      <section className="py-12 bg-grey-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-rajdhani font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "Category")
                }
                className="cursor-pointer hover:shadow-md border-gray-200 shadow-none transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-rajdhani text-lg font-medium">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* shop by brand */}
      <section className="py-12 bg-grey-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-rajdhani font-bold text-center mb-5">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "Brand")}
                className="cursor-pointer hover:shadow-md border-gray-200 shadow-none transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-rajdhani text-lg font-medium">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* featured products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-rajdhani font-extrabold text-center mb-9">
            Featured Products
          </h2>

          {/* Loader for productList */}
          {!productList ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList.length > 0 ? (
                productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleAddtoCart={handleAddtoCart}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    isAddingToCart={addingToCartId === productItem._id}
                  />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  No products found.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
