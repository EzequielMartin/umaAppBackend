const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../config/config");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  //Separo las validaciones de usuario y contraseña para poder hacer tests individuales

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: "Usuario incorrecto" });
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 3600 });

  res.status(200).send({ token, username: user.username });
});

module.exports = loginRouter;
