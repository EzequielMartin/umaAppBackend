const config = require("./config/config");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const umasRouter = require("./controllers/umas");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/umas", umasRouter);

module.exports = app;
