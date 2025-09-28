const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        lowercase: true 
    },
    brand: {
        type : String, 
        lowercase: true 
    },
    price: {
        type: Number
    },
    salePrice: {
        type: Number
    },
    totalStock: {
        type: Number
    }
},{timestamps: true});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;