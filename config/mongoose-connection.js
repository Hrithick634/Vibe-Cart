require("dotenv").config();
const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");

const MONGODB_URI = process.env.MONGO_URL ;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => debug("MongoDB connection error:", err));

module.exports = mongoose.connection;
