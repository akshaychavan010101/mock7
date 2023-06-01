const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
  },
  menu: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String },
      description: { type: String },
      price: { type: Number },
      image: { type: String },
    },
  ],
});

const RestaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = { RestaurantModel };
