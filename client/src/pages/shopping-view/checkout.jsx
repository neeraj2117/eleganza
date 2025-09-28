import { useDispatch, useSelector } from "react-redux";
import img from "../../assets/account.jpg";
import Address from "./address";
import UserCartItemsContent from "./cart-items-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  // Calculate subtotal
  const subtotal =
    cartItems?.items?.reduce(
      (acc, item) =>
        acc +
        (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
      0
    ) || 0;

  // Example rules
  const discount = subtotal > 100 ? subtotal * 0.1 : 0; // 10% discount if subtotal > $100
  const gst = subtotal * 0.18;
  const shipping = subtotal > 300 ? 0 : 20; // free shipping above $300

  const total = subtotal - discount + gst + shipping;

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0){
      toast.error('Your cart is empty. Please add items to proceed');
      return;
    }

    if (currentSelectedAddress === null){
      toast.error('Please select any one address to proceed.');
      return;
    }

    setIsPaymentStart(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.price,
        salePrice:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: total,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
      } else {
        toast.error("Something went wrong!");
        setIsPaymentStart(false);
      }
    });
  }

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);


  return (
    <div className="flex flex-col font-[Rajdhani]">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full overflow-hidden object-center"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 p-5">
        {/* LEFT: Address */}
        <div className="md:col-span-2">
          <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
        </div>

        {/* RIGHT: Cart */}
        <div className="flex flex-col border text-left border-gray-200 rounded-xl p-4 mt-6 gap-4">
          {cartItems?.items?.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item._id} cartItem={item} />
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty</p>
          )}

          {/* Summary */}
          <div className="flex flex-col gap-2 border-t mt-4 border-gray-200 pt-7 pb-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>${gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold font-rajdhani text-2xl">
              <span>Total</span>
              <span className="text-green-600 text-3xl">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full h-13 text-lg cursor-pointer flex items-center justify-center"
              disabled={isPaymentStart}
            >
              {isPaymentStart ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Redirecting to PayPal...
                </>
              ) : (
                "Checkout at Paypal"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
