import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order_slice";
import { toast } from "sonner";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails, onClose}) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleUpdateOrderStatus(event) {
    event.preventDefault();
    if (formData.status === orderDetails?.orderStatus) return;
    const { status } = formData;

    dispatch(
      updateOrderStatus({
        id: orderDetails?._id,
        orderStatus: status,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData({ status: "" });
        toast.success("Order status updated successfully!", {
          style: {
            background: "#fff", 
            color: "#000",
          },
          iconTheme: {
            primary: "#000",
            secondary: "#fff", 
          },
        });
        if (onClose) onClose();
      }
    });
  }

  useEffect(() => {
    if (orderDetails?.orderStatus) {
      setFormData({ status: orderDetails.orderStatus });
    }
  }, [orderDetails]);

  return (
    <DialogContent className="sm:max-w-[700px] font-[Rajdhani] rounded-2xl shadow-lg max-h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 mt-4">
        
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
                    orderDetails?.orderStatus === "confirmed" ||
                    orderDetails?.orderStatus === "delivered"
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
              <p className="font-semibold text-lg text-gray-700">
                Payment Method
              </p>
              <Label className="font-medium text-[16px] text-gray-900">
                {orderDetails?.paymentMethod.toUpperCase()}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg text-gray-700">
                Payment Status
              </p>
              <Label className="font-medium text-[16px] text-gray-900">
                {orderDetails?.paymentStatus.toUpperCase()}
              </Label>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div>
          <div className="text-lg font-semibold mb-1 text-gray-800">
            Order Details
          </div>
          <ul
            className="rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white shadow-sm 
                 max-h-[200px] overflow-y-auto"
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
              {orderDetails?.user?.userName}
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

      {/* Update Form */}
      <div className="pt-4 border-t border-gray-200 bg-white">
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText="Update Order Status"
          onSubmit={handleUpdateOrderStatus}
          className="w-full"
        />
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
