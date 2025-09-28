import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { Loader2, Heart, Star } from "lucide-react";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const { reviews } = useSelector((state) => state.shopReview);

  // add to cart
  function handleAddToCart() {
    if (!productDetails?._id) return;

    setIsAdding(true);

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails._id,
        quantity,
      })
    ).then((data) => {
      setTimeout(() => {
        setIsAdding(false);

        if (data?.payload?.success) {
          toast.success("Product added to Cart!");
          dispatch(fetchCartItems(user?.id));
        }
      }, 800);
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // function handleAddReview() {
  //   dispatch(
  //     addReview({
  //       productId: productDetails._id,
  //       userId: user?.id,
  //       userName: user?.userName,
  //       reviewMessage: reviewMsg,
  //       reviewValue: rating,
  //     },)
  //   ).then((data) => {
  //     if (data?.payload?.success) {
  //       setRating(0);
  //       setReviewMsg("");
  //       dispatch(getReviews(productDetails?._id));
  //       toast.success("Review added successfully!");
  //     }
  //   });
  // }

  function handleAddReview() {
    dispatch(
      addReview({
        formdata: {
          productId: productDetails._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        },
        token: localStorage.getItem("token"),
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast.success("Review added successfully!");
      }
    });
  }

  useEffect(() => {
    dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : null;

  console.log("Review rating:", reviews.reviewValue);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="p-0 font-[Rajdhani] max-w-[95vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {productDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-8 lg:p-12">
            {/* Left: Product Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={productDetails.image}
                alt={productDetails.title}
                className="w-full h-[670px] object-cover cursor-pointer transform transition-transform duration-500 hover:scale-115"
              />
              {productDetails?.salePrice > 0 && (
                <Badge className="absolute top-4 left-4 text-lg font-light bg-red-500 hover:bg-red-600 text-white font-rajdhani">
                  {Math.round(
                    ((productDetails.price - productDetails.salePrice) /
                      productDetails.price) *
                      100
                  )}
                  % Off
                </Badge>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col gap-6">
              {/* Title + Rating + Description */}
              <div>
                <h1 className="text-4xl font-rajdhani font-extrabold mb-2">
                  {productDetails.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-yellow-500">
                    <StarRatingComponent rating={averageReview || 0} />
                  </div>
                  <span className="font-rajdhani text-muted-foreground text-lg">
                    ({averageReview ? averageReview.toFixed(2) : "0.00"})
                  </span>
                </div>

                <p className="text-muted-foreground text-lg font-rajdhani leading-relaxed">
                  {productDetails.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <p
                  className={`text-2xl font-semibold text-gray-500 font-rajdhani ${
                    productDetails?.salePrice > 0 ? "line-through" : ""
                  }`}
                >
                  ${productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 && (
                  <p className="text-3xl text-green-600 font-bold font-rajdhani">
                    ${productDetails.salePrice}
                  </p>
                )}
              </div>

              {/* Quantity + CTA */}
              <div className="flex flex-col gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center mb-1 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 flex items-center justify-center cursor-pointer text-xl font-light"
                    onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
                  >
                    -
                  </Button>
                  <span className="font-rajdhani text-xl font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 flex items-center justify-center cursor-pointer text-xl font-light"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 font-rajdhani text-lg h-14 cursor-pointer"
                  >
                    {isAdding ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 font-rajdhani cursor-pointer text-lg flex items-center justify-center gap-3 h-14"
                  >
                    <Heart className="w-10 h-10 text-red-600 fill-red-600" />
                    <span className="text-lg">Wishlist</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Reviews */}
              <div className="max-h-[250px] overflow-auto">
                <h2 className="text-xl font-bold mb-3">Reviews</h2>
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div className="grid gap-6 mb-0">
                      <div className="flex gap-2">
                        <Avatar className="w-12 h-12 border-none">
                          <AvatarFallback className="bg-black text-white">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid">
                          <div className="flex items-center gap-1">
                            <h3 className="font-rajdhani font-semibold text-lg">
                              {reviewItem?.userName}
                            </h3>
                            <div className="flex ml-1 mb-1 text-yellow-500">
                              <StarRatingComponent
                                rating={reviewItem?.reviewValue || 0}
                                readOnly
                              />
                            </div>
                          </div>
                          <p className="text-muted-foreground text-[16px]">
                            {reviewItem?.reviewMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Review</h1>
                )}

                {/* Review Input */}
                <div className="flex flex-col px-2 mt-7 gap-1">
                  <Label className="text-lg font-medium">Write a review</Label>
                  <div className="flex gap-2">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    type="text"
                    placeholder="Write your review..."
                    className="flex-1 border mb-2 mt-1 border-gray-300 rounded-md px-3 py-2 text-[16px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                    className="px-4 py-5 font-medium cursor-pointer"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[300px]">
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
