const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    CustomerName: String,
    TotalCost: Number,
    OrderDate: {
        type: Date,
        default: Date.now,
    },
    OrderItems: [
        {
            OrderItemName: String,
            OrderItemPrice: Number,
            OrderItemQuantity: Number,
        }
    ]
});

module.exports = mongoose.model("Order", OrderSchema);