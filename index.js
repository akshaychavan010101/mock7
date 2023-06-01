const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
require("dotenv").config();
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { UsersRouter } = require("./routes/users.routes");
const { RestaurantsRouter } = require("./routes/restaurants.routes");
const { OrdersRouter } = require("./routes/orders.routes");
const { authenticate } = require("./middlewares/authentication");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food App Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4500",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(UsersRouter);
app.use(authenticate);
app.use(RestaurantsRouter);
app.use(OrdersRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Server is running and database connected");
  } catch (error) {
    console.log(error);
  }
});
