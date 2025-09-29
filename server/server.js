const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/product-routes');
const adminOrderRouter = require('./routes/admin/order-routes');

const shopProductsRouter = require('./routes/shop/shop-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require('./routes/shop/order-routes');
const shopSearchRouter = require('./routes/shop/search-routes');
const shopReviewRouter = require('./routes/shop/review-routes');
const featureRouter = require('./routes/feature/feature-routes');

const app = express();
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"))
  .catch((error) => console.log(error));

app.use(cors({
  origin: "https://eleganza-frontend.onrender.com",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// admin routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter); 
app.use("/api/admin/orders", adminOrderRouter); 

// shop routes
app.use("/api/shop/products", shopProductsRouter); 
app.use("/api/shop/cart", shopCartRouter); 
app.use("/api/shop/address", shopAddressRouter); 
app.use("/api/shop/order", shopOrderRouter);  
app.use("/api/shop/search", shopSearchRouter);  
app.use("/api/shop/review", shopReviewRouter); 

app.use("/api/common/feature", featureRouter); 

app.post("/test", (req, res) => {
  res.json({ success: true, msg: "Test route works" });
});

app.listen(PORT, () =>
  console.log(`Server is now running at port: ${PORT}`)
);

app.get("/", (req, res) => res.send("Backend is running!"));
