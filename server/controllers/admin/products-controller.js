const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product"); 


/* Handle image upload to Cloudinary */
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Convert buffer to base64 string
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const result = await imageUploadUtil(url);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(400).json({
      success: false,
      message: "Error occurred while uploading",
    });
  }
};

/* Add a new product */
const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      category,
      brand,
      salePrice,
      totalStock,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      image,
      category,
      brand,
      salePrice,
      totalStock,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
    });
  }
};

/* Fetch all products */
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
    });
  }
};

/* Update product */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      image,
      category,
      brand,
      salePrice,
      totalStock,
    } = req.body;


    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update only provided fields
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.price = price === '' ? 0 : price || findProduct.price;
    findProduct.image = image || findProduct.image;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;

    // Save updated product
    const updatedProduct = await findProduct.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating product",
    });
  }
};

/* Delete product */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting product",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
};
