const express = require("express");
const router = express.Router();
const API = require("../controllers/api");

router.get("/", API.homeRoute);
router.get("/products", API.fetchAllProducts);
router.post("/newProduct", API.createProduct);
router.get("/orders", API.fetchAllOrders);
router.post("/newOrder", API.createOrder);
router.get("/order/:id", API.getOrderById);
router.get("/product/:id", API.getProductById);
router.patch("/product/:id", API.updateProduct);
router.delete("/product/:id", API.deleteProduct);

module.exports = router;