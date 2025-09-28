import ShoppingOrderDetailsView from "@/components/shopping-view/order-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetails(getId))
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true)
  }, [orderDetails]);

  console.log("order details", orderDetails);

  return (
    <Card className="font-[Rajdhani] border-gray-200 shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl mb-3 text-left">Order History</CardTitle>
      </CardHeader>
      <CardContent className="ml-3">
        <Table>
          <TableHeader>
            <TableRow className="text-lg border-b border-gray-200 bg-gray-50">
              <TableHead className="text-center font-semibold text-gray-600">
                Order Id
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600">
                Order Date
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600">
                Order Status
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600">
                Order Price
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-600">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow
                  key={orderItem._id}
                  className="text-[15px] border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <TableCell className="text-center text-[16px] align-middle text-gray-700 font-medium">
                    {orderItem?._id}
                  </TableCell>
                  <TableCell className="text-center text-[16px] align-middle text-gray-600">
                    {orderItem?.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <Badge
                      className={`px-3 cursor-pointer py-1 text-[13px] font-medium rounded-full capitalize transition-colors duration-200
                      ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-600/90 text-white hover:bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600/90 text-white hover:bg-red-400"
                          : "bg-gray-500/80 text-white hover:bg-gray-400"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-[16px] align-middle text-gray-700 font-semibold">
                    ${orderItem?.totalAmount}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false)
                        dispatch(resetOrderDetails())
                      }}
                    >
                      <Button
                        onClick={() => {
                          setOpenDetailsDialog(true)
                          handleFetchOrderDetails(orderItem?._id)
                        }}
                        className="mx-auto mt-.5 cursor-pointer bg-black hover:bg-black/80 text-white rounded-lg"
                      >
                        View Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails}/>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
