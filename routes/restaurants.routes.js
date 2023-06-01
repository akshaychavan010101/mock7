const express = require("express");
require("dotenv").config();
const { RestaurantModel } = require("../models/restaurants.model");
const { MenuModel } = require("../models/menu.model");

const RestaurantsRouter = express.Router();

RestaurantsRouter.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.status(200).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

RestaurantsRouter.post("/api/restaurants", async (req, res) => {
  try {
    const payload = req.body;
    const restaurant = await RestaurantModel.findOne(payload);

    if (restaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const newRestaurant = await RestaurantModel(payload);
    await newRestaurant.save();

    res.status(201).json({ message: "Restaurant added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

RestaurantsRouter.get("/api/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await RestaurantModel.findOne({ _id: id });
    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

RestaurantsRouter.get("/api/restaurants/:id/menu", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await RestaurantModel.findOne({ _id: id });
    res.status(200).json({ menu: restaurant.menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

RestaurantsRouter.post("/api/restaurants/:id/menu", async (req, res) => {
  try {
    const payload = req.body.menu;
    const id = req.params.id;
    const restaurant = await RestaurantModel.findOne({ _id: id });


    const newMenu = await MenuModel(payload);
    const payloadId = newMenu._id;

    restaurant.menu.push({ ...payload, _id: payloadId });

    await restaurant.save();

    res.status(201).json({ message: "Menu added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

RestaurantsRouter.delete(
  "/api/restaurants/:id/menu/:menuid",
  async (req, res) => {
    try {
      const id = req.params.id;
      const menuid = req.params.menuid;

      const restaurant = await RestaurantModel.findOne({ _id: id });

      restaurant.menu = restaurant.menu.filter((menu) => menu._id != menuid);

      await restaurant.save();

      res.status(202).json({ message: "Menu deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = { RestaurantsRouter };

