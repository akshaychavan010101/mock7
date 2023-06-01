const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/users.model");
require("dotenv").config();

const UsersRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *         User:
 *          type: object
 *          properties:
 *              id:
 *                 type: string
 *                 description: The auto-generated id of the user
 *              name:
 *                  type: string
 *                  description: The user name
 *              email:
 *                  type: string
 *                  description: The user email
 *              password:
 *                  type: string
 *                  description: Password of the user
 *              address:
 *                 type: object
 *                 properties:
 *                       street:
 *                          type: string
 *                          description: The street of the user
 *
 *                       city:
 *                          type: string
 *                          description: The city of the user
 *
 *                       state:
 *                          type: string
 *                          description: The state of the user
 *
 *                       country:
 *                          type: string
 *                          description: The country of the user
 *
 *                       zip:
 *                          type: string
 *                          description: The zip of the user
 *
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: All the API routes related to User
 */
/**
 * @swagger
 * /users/api/register:
 * post:
 *      summary: This will allow  the user to register to the database
 *      tags: [Users]
 *      responses:
 *          201:
 *              description: user registration
 *              content:
 *                    application/json:
 *                          schema:
 *                              type: json
 *                              item:
 *                                  $ref: "#/components/schemas/UserModel"
 *
 */
UsersRouter.post("/api/register", async (req, res) => {
  try {
    const payload = req.body;
    const user = await UserModel.findOne({
      email: payload.email,
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new UserModel(payload);
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// /**

// * @swagger
// * /users/api/login:
// * post:
// *      summary: To post the details of a new user
// *      tags: [Users]
// *      requestBody:
// *          required: true
// *          content:
// *                 application/json:
// *                 schema:
// *                      $ref: '#/components/schemas/User'
// *                  responses:
// *                       200:
// *                  description: The user was successfully loggedin
// *                      content:
// *                          application/json:
// *                                     schema:
// *                                          $ref: '#/components/schemas/UserModel'
// *                                           500:
// *                                              description: Some server error
// */

UsersRouter.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

UsersRouter.patch("/api/user/:id/reset", async (req, res) => {
  try {
    const id = req.params.id;
    let { oldPassword, newPassword } = req.body;
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password Does Not Match" });
    }

    const hash = bcrypt.hashSync(newPassword, 5);
    newPassword = hash;

    await UserModel.updateOne({ _id: id }, { password: newPassword });

    res.status(204).json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { UsersRouter };
