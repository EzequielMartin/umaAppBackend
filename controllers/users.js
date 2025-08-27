const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username || password)) {
      return res
        .status(400)
        .json({ error: "El usuario y contraseña son requeridos" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "El username ya esta en uso" });
    }
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({}).populate("umas", {
      name: 1,
      hair_color: 1,
      eye_color: 1,
      height: 1,
      avatar: 1,
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
  }
});

module.exports = usersRouter;
