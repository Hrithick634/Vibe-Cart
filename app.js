require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

const ownerRouters = require("./routes/ownerRouters");
const productsRouters = require("./routes/productsRouters");
const usersRouters = require("./routes/usersRouters");
const indexRouter = require("./routes/index");
const shopRouter = require("./routes/index");


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "my_super_secret_key",
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/shop", shopRouter);
app.use("/owners", ownerRouters);
app.use("/users", usersRouters);
app.use("/products", productsRouters);

app.listen(3000, () => console.log("Server is running on port 3000..."));
