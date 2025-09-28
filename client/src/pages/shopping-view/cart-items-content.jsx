import { Minus, Plus, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    const cartItemsArray = cartItems?.items || []; // extract the array

    if (typeOfAction === "plus") {
      const index = cartItemsArray.findIndex(
        (item) => item.productId === getCartItem.productId
      );

      const getCurrentProductIndex = productList.findIndex(
        (product) => product._id === getCartItem.productId
      );
      const getTotalStock = productList[getCurrentProductIndex]?.totalStock;

      if (index > -1) {
        const currentQty = cartItemsArray[index].quantity;
        if (currentQty + 1 > getTotalStock) {
          toast.error(`Only ${currentQty} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item updated successfully");
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item is deleted successfully");
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium font-rajdhani text-lg">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-0">
          <Button
            variant="outline"
            className="h-5 w-5 rounded-full cursor-pointer p-0 flex items-center justify-center"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-1 h-1" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="text-xl font-rajdhani font-semibold">
            {cartItem?.quantity}
          </span>
          <Button
            variant="outline"
            className="h-5 w-5 rounded-full cursor-pointer p-0 flex items-center justify-center"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-1 h-1" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-bold font-rajdhani text-xl">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
