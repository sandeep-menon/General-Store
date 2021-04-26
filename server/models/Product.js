const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    ProductName: String,
    ProductPrice: Number,
    ProductQuantity: Number
});

module.exports = mongoose.model("Product", ProductSchema);