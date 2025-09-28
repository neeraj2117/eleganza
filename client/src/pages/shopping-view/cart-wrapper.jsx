import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCart from "../../assets/empty-ghost.json";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cartItems?.reduce(
    (acc, item) =>
      acc + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );

  // Example rules
  const discount = subtotal > 100 ? subtotal * 0.1 : 0; // 10% discount if subtotal > $100
  const gst = subtotal * 0.18;
  const shipping = subtotal > 300 ? 0 : 20; // free shipping above $300

  const total = subtotal - discount + gst + shipping;

  return (
    <SheetContent
      className="sm:max-w-md font-[Rajdhani] flex flex-col justify-between h-full p-6"
      side="right"
    >
      {/* Header */}
      <SheetHeader>
        <SheetTitle className="font-rajdhani text-2xl">Your Cart</SheetTitle>
      </SheetHeader>

      {/* Cart Items */}
      <div className="flex-1 mt-6 overflow-y-auto pr-1">
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
            <Lottie
              animationData={emptyCart}
              loop
              autoplay
              style={{ height: "400px", width: "400px" }}
            />
            <p className="text-2xl font-semibold text-gray-700 mt-0">
              Your cart is empty!
            </p>
            <p className="text-lg font-light text-gray-900">
              Go and add some items in you cart.
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {cartItems && cartItems.length > 0 && (
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-[16px] font-rajdhani">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[16px]  font-rajdhani">
            <span>GST (18%)</span>
            <span>${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[16px]  font-rajdhani">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[17px] font-medium text-green-600 font-rajdhani">
              <span>Discount</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold font-rajdhani text-2xl border-t border-gray-200 pt-3">
            <span>Total</span>
            <span className="text-green-600 text-3xl">${total.toFixed(2)}</span>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-2 cursor-pointer text-lg font-semibold font-rajdhani h-12"
          >
            Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
