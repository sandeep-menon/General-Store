const Product = require("../models/Product");
const Order = require("../models/Order");
const { validate } = require("../models/Product");

module.exports = class API {
    // home route
    static async homeRoute(req, res) {
        res.send("there is no home");
    }

    // fetch all products 
    static async fetchAllProducts(req, res) {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch(err) {
            res.status(404).json({ message: err.message });
        }
    }

    // create new product
    static async createProduct(req, res) {
        try {
            const ProductName = req.body.ProductName;
            const ProductPrice = req.body.ProductPrice;
            const ProductQuantity = req.body.ProductQuantity;

            if(ProductName == "" || ProductPrice == "" || ProductQuantity == "" || ProductName == null || ProductPrice == null || ProductQuantity == null || ProductName == undefined || ProductPrice == undefined || ProductQuantity == undefined) {
                res.status(400).json({ message: "Mandatory information missing" });
            } else {
                // first find if such a product already exists
                Product.findOne({ ProductName: ProductName })
                    .then( (product) => {
                        if(product) {
                            // then check if price is same
                            if(product.ProductPrice != ProductPrice) {
                                // products of the same name should have same price
                                res.status(201).json( {message: "Same product with different price already exists"} );
                            } else {
                                // if price is same then just update quantity in stock
                                const currentQuantity = parseFloat(product.ProductQuantity);
                                const newQuantity = parseFloat(ProductQuantity) + currentQuantity;

                                const productQuery = { ProductName: product.ProductName }
                                var updateQuantity = {$set: 
                                    {
                                        ProductQuantity: newQuantity
                                    }
                                }
                                const updatedProduct = Product.updateOne( productQuery, updateQuantity, (err, resp) => {
                                    if(err) {
                                        res.status(400).json( {message: err.message} );
                                    } else {
                                        res.status(201).json( {message: "Product quantity has been updated"} );
                                    }
                                });
                            }
                        } else {
                            // if product does not exist then create a new product
                            const newProduct = new Product({
                                ProductName: ProductName,
                                ProductPrice: ProductPrice,
                                ProductQuantity: ProductQuantity
                            });
                            newProduct.save();
                            res.status(201).json( {message: "Product added to inventory", newProductId: newProduct._id });
                        }
                    });
            }

            
        } catch(err) {
            res.status(400).json( {message: err.message });
        }
    }

    static async fetchAllOrders(req, res) {
        try {
            const orders = await Order.find().sort('-OrderDate');
            res.status(200).json(orders);
        } catch(err) {
            res.status(404).json({ message: err.message });
        }
    }

    static async createOrder(req, res) {
        const validOrder = validateOrder(req.body);

        if(validOrder == "Y") {
            // subtract from product inventory
            const CustomerName = req.body.CustomerName;
            const TotalCost = req.body.TotalCost;
            const OrderItems = req.body.OrderItems;

            new Promise((resolve, reject) => {
                for(var i=0; i<OrderItems.length; i++) {
                    let orderItemName = OrderItems[i].OrderItemName;
                    let orderItemPrice = OrderItems[i].OrderItemPrice;
                    let orderItemQuantity = OrderItems[i].OrderItemQuantity;
    
                    Product.findOne( {ProductName: orderItemName })
                        .then( (product) => {
                            if(product) {
                                if(product.ProductPrice == orderItemPrice) {
                                    if(product.ProductQuantity >= orderItemQuantity) {
    
                                        const currentQuantity = parseFloat(product.ProductQuantity);
                                        const newQuantity = currentQuantity - parseFloat(orderItemQuantity);
    
                                        const productQuery = { ProductName: product.ProductName }
                                        var updateQuantity = {$set: 
                                            {
                                                ProductQuantity: newQuantity
                                            }
                                        }
                                        const updatedProduct = Product.updateOne( productQuery, updateQuantity, (err, resp) => {
                                            if(err) {
                                                reject({message: err.message});
                                            } else {
                                                // if the product inventory is updated for the last order line item
                                                if(i == OrderItems.length) {
                                                    resolve();
                                                }
                                            }
                                        });
    
                                    } else {
                                        reject({message: "Insufficient quantity in stock for " +orderItemName});
                                    }
                                } else {
                                    reject({message: "Product price does not match for " +orderItemName});
                                }
                            } else {
                                reject({message: "Product not found"});
                            }
                        })
                        .catch((err) => {
                            reject({message: "Failed to create the order" + err.message });
                        })
                }
            }).then( () => {
                const newOrder = new Order({
                    CustomerName: CustomerName,
                    TotalCost: TotalCost,
                    OrderItems: OrderItems
                });
                newOrder.save();
                res.status(201).json( {message: "Order created successfully" });
            }).catch( (err) => {
                res.status(400).json({ message: "Failed to create order because: " + err.message });
            })

        } else {
            res.status(400).json( {message: "Order is not valid"} );
        }
    }

    static async getOrderById(req, res) {
        let orderId = req.params.id;
        Order.findById(orderId)
            .then((order) => {
                if(order) {
                    res.status(200).json(order);
                } else {
                    res.status(200).json({ message: "No such order found" });
                }
            })
            .catch((err) => {
                res.status(400).json({ message: err.message });
            })
    }

    static async getProductById(req, res) {
        let productId = req.params.id;
        Product.findById(productId)
            .then( (product) => {
                if(product) {
                    res.status(200).json(product);
                } else {
                    res.status(200).json( {message: "Product not found"} );
                }
            })
            .catch( (err) => {
                res.status(400).json({ message: err.message });
            })
    }

    static async deleteProduct(req, res) {
        let productId = req.params.id;

        if(productId) {
            Product.findByIdAndRemove(productId)
                .then( () => {
                    res.status(200).json({ message: "Product removed from inventory" });
                })
                .catch( (err) => {
                    res.status(400).json({ message: err.message });
                })
        } else {
            res.status(400).json({ message: "Product Id missing "});
        }
    }

    static async updateProduct(req, res) {
        let productId = req.params.id;
        let newProductName = req.body.ProductName;
        let newProductPrice = req.body.ProductPrice;
        let newProductQuantity = req.body.ProductQuantity;
        const updatedProduct = {
            ProductName: newProductName,
            ProductPrice: newProductPrice,
            ProductQuantity: newProductQuantity
        }
        Product.findByIdAndUpdate(productId, updatedProduct)
            .then( (product) => {
                if(product) {
                    res.status(200).json({ message: "Product updated succesfully" });
                } else {
                    res.status(200).json({ message: "Product not found" });
                }
            })
            .catch( (err) => {
                res.status(400).json({ message: err.message });
            })
    }
}

function validateOrder(order) {
    try {
        const orderTotal = parseFloat(order.TotalCost);
        let lineItemsTotal = 0;
        for(var i=0; i<order.OrderItems.length; i++) {
            lineItemsTotal = lineItemsTotal + ( parseFloat(order.OrderItems[i].OrderItemPrice) * parseFloat(order.OrderItems[i].OrderItemQuantity) );
        }

        // validation 1 -> all orders must have atleast one order line item
        if(order.OrderItems.length == 0) {
            console.log("validation 1 failed");
            throw "N";
        }

        // validation 2 -> order total should be equal to total of all line items
        if(lineItemsTotal.toFixed(2) !== orderTotal.toFixed(2)) {
            console.log("Order header = " + orderTotal.toFixed(2));
            console.log("Order line total = " + lineItemsTotal.toFixed(2));
            console.log("validation 2 failed");
            throw "N";
        }

        // if all validations pass
        return "Y";

    } catch (e) {
        console.log(e);
        return "N";
    }
}