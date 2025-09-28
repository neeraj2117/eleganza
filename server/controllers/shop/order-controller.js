const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");


const createOrder = async (req, res) => {
  console.log(
    "📥 Incoming createOrder request:",
    JSON.stringify(req.body).slice(0, 1000)
  ); // log head of payload

  try {
    const {
      userId,
      cartItems = [],
      addressInfo,
      orderStatus = "pending",
      paymentMethod = "paypal",
      paymentStatus = "pending",
      totalAmount: clientTotalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // 1) compute amounts on server (same rules as frontend)
    const subtotal = cartItems.reduce((acc, item) => {
      const price = item.salePrice > 0 ? item.salePrice : item.price;
      return acc + Number(price) * Number(item.quantity || 1);
    }, 0);

    const discount = subtotal > 100 ? subtotal * 0.1 : 0; // 10% if subtotal > 100
    const gst = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 300 ? 0 : 20;
    const total = subtotal - discount + gst + shipping;

    console.log("🔢 Calculated totals ->", {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      gst: gst.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      clientTotalAmount,
    });

    // 2) create DB order first so we have orderId to include in PayPal return url
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount: total,
      orderDate,
      orderUpdateDate,
      paymentId: "", // will fill after PayPal creates payment
      payerId: "",
    });

    await newOrder.save();
    console.log("💾 Order saved (pre-paypal) id:", newOrder._id);

    // 3) build PayPal items & payload
    const items = cartItems.map((item) => {
      const price = item.salePrice > 0 ? item.salePrice : item.price;
      return {
        name: item.title,
        sku: String(item.productId),
        price: Number(price).toFixed(2),
        currency: "USD",
        quantity: Number(item.quantity || 1),
      };
    });

    const create_payment_json = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        // include orderId so PayPal redirects back with it
        return_url: `http://localhost:5173/shop/paypal-return?orderId=${newOrder._id}`,
        cancel_url: `http://localhost:5173/shop/paypal-cancel?orderId=${newOrder._id}`,
      },
      transactions: [
        {
          item_list: { items },
          amount: {
            currency: "USD",
            total: total.toFixed(2),
            details: {
              subtotal: subtotal.toFixed(2),
              tax: gst.toFixed(2),
              shipping: shipping.toFixed(2),
              // PayPal expects shipping_discount to be negative if you apply discount
              // we'll use shipping_discount to apply the discount amount (negative string)
              shipping_discount: (-discount).toFixed(2),
            },
          },
          description: "Ecommerce order payment",
        },
      ],
    };

    console.log(
      "➡️ Final PayPal Payload:",
      JSON.stringify(create_payment_json, null, 2)
    );

    // 4) create PayPal payment
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      console.log("🛠 Inside PayPal callback");
      if (error) {
        console.error(
          "❌ PayPal creation error:",
          error && error.response ? error.response : error
        );
        // Optionally remove the created order to avoid orphan orders
        // await Order.findByIdAndDelete(newOrder._id);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment",
          error: error && error.response ? error.response : error,
        });
      }

      console.log("✅ PayPal response:", JSON.stringify(paymentInfo, null, 2));

      const approvalLink =
        paymentInfo.links &&
        paymentInfo.links.find((l) => l.rel === "approval_url");
      const approvalURL = approvalLink ? approvalLink.href : null;
      console.log("🔎 Extracted approvalURL:", approvalURL);

      // 5) store PayPal payment id into order and return response
      newOrder.paymentId = paymentInfo.id || "";
      await newOrder.save();
      console.log("💾 Updated order with paymentId:", newOrder.paymentId);

      return res.status(201).json({
        success: true,
        approvalURL,
        orderId: newOrder._id,
      });
    });
  } catch (err) {
    console.error("❗ createOrder exception:", err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
      error: err.message,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
