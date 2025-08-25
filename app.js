const config = require("./config/config");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const umasRouter = require("./controllers/umas");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/umas", umasRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

module.exports = app;
