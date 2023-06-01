const express = require("express");

const OrdersRouter = express.Router();

const { OrderModel } = require("../models/orders.model");

OrdersRouter.post("/api/orders", async (req, res) => {
  try {
    const payload = {
      user: req.userid,
      restaurant: req.body.restaurant,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      deliveryAddress: req.body.deliveryAddress,
    };

    const newOrder = await OrderModel(payload);
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

OrdersRouter.get("/api/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const order = await OrderModel.findOne({ _id: id });

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

OrdersRouter.patch("/api/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const status = req.body.status;

    await OrderModel.findByIdAndUpdate(id, { status });

    res.status(204).json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { OrdersRouter };
