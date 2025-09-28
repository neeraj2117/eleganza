import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[650px] font-[Rajdhani] rounded-2xl shadow-xl bg-white">
      <div className="grid mt-4 gap-8">
        {/* Order Summary */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">Order ID</p>
              <Label className="font-medium text-[16px] text-gray-800">
                {orderDetails?._id}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">Order Date</p>
              <Label className="font-medium text-[16px] text-gray-800">
                {orderDetails?.orderDate.split("T")[0]}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">
                Order Status
              </p>
              <Badge
                className={`px-3 py-1 text-[14px] font-medium cursor-pointer rounded-full capitalize transition-colors duration-200
                  ${
                    orderDetails?.orderStatus === "confirmed"
                      ? "bg-green-600/90 text-white hover:bg-green-500"
                      : orderDetails?.orderStatus === "rejected"
                      ? "bg-red-600/90 text-white hover:bg-red-400"
                      : "bg-gray-600/80 text-white hover:bg-gray-400"
                  }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">Order Price</p>
              <Label className="font-medium text-[16px] text-gray-900">
                ${orderDetails?.totalAmount}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">Payment Method</p>
              <Label className="font-medium text-[16px] text-gray-900">
                {orderDetails?.paymentMethod.toUpperCase()}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">Payment Status</p>
              <Label className="font-medium text-[16px] text-gray-900">
                {orderDetails?.paymentStatus.toUpperCase()}
              </Label>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div>
          <div className="text-lg font-semibold mb-3 text-gray-800">
            Order Details
          </div>
          <ul
            className="rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white shadow-sm 
                 max-h-50 overflow-y-auto"
          >
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item) => (
                  <li
                    key={item?._id}
                    className="grid grid-cols-3 items-center px-5 py-3 text-[15px]"
                  >
                    {/* Title - left aligned */}
                    <span className="font-medium text-gray-700 text-left">
                      {item?.title}
                    </span>

                    {/* Qty - centered */}
                    <span className="text-gray-600 text-center">
                      Qty: {item?.quantity}
                    </span>

                    {/* Price - right aligned */}
                    <span className="font-medium text-gray-800 text-right">
                      ${item?.price}
                    </span>
                  </li>
                ))
              : null}
          </ul>
        </div>

        {/* Shipping Info */}
        <div>
          <div className="text-lg font-semibold mb-1 text-gray-800">
            Shipping Info
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-[15px] text-gray-700 space-y-1 shadow-sm">
            <p>
              <span className="font-medium text-[16px]">Username:</span>{" "}
              {user?.userName}
            </p>
            <p>
              <span className="font-medium text-[16px]">Address:</span>{" "}
              {orderDetails?.addressInfo?.address}
            </p>
            <p>
              <span className="font-medium text-[16px]">City:</span>{" "}
              {orderDetails?.addressInfo?.city}
            </p>
            <p>
              <span className="font-medium text-[16px]">Pincode:</span>{" "}
              {orderDetails?.addressInfo?.pincode}
            </p>
            <p>
              <span className="font-medium text-[16px]">Phone:</span>{" "}
              {orderDetails?.addressInfo?.phone}
            </p>
            <p>
              <span className="font-medium text-[16px]">Notes:</span>{" "}
              {orderDetails?.addressInfo?.notes}
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;


