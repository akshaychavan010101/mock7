const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zip: { type: String, required: true },
  },
});

userSchema.pre("save", function (next) {
  let hash = bcrypt.hashSync(this.password, 5);
  this.password = hash;
  next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
