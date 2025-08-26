const umasRouter = require("express").Router();
const Uma = require("../models/uma");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

//Armo un middleware para obtener el token y para la validacion de errores del token
const tokenExtractor = (req, res, next) => {
  const token = getTokenFrom(req);
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token invalido" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token requerido" });
  }
};

//Obtener todas las umas de la BD
umasRouter.get("/", tokenExtractor, async (req, res) => {
  const umas = await Uma.find({ user: req.user.id });
  res.status(200).json(umas);
});

//Obtener una uma por ID
umasRouter.get("/:id", tokenExtractor, async (req, res) => {
  try {
    const uma = await Uma.findById(req.params.id);
    if (!uma) {
      return res.status(400).json({ error: "Uma no encontrada" });
    }
    res.status(200).json(uma);
  } catch (error) {
    res.status(400).json({ error: "ID invalido o error en la busqueda" });
  }
});

//Agregar una uma a la BD
umasRouter.post("/", tokenExtractor, async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findById(req.user.id);

    const uma = new Uma({
      name: body.name,
      hair_color: body.hair_color,
      eye_color: body.eye_color,
      height: body.height,
      avatar: body.avatar,
      user: user.id,
    });

    const savedUma = await uma.save();
    user.umas = user.umas.concat(savedUma._id);
    await user.save();

    res.status(201).json(savedUma);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la uma" });
  }
});

//Editar una uma por id
umasRouter.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const updatedUma = await Uma.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUma) {
      return res.status(404).json({ error: "Uma no encontrada" });
    }
    res.status(200).json(updatedUma);
  } catch (error) {
    res.status(400).json({ error: "ID invalido o error al actualizar" });
  }
});

//Eliminar una uma por id
umasRouter.delete("/:id", tokenExtractor, async (req, res) => {
  try {
    const umaToDelete = await Uma.findByIdAndDelete(req.params.id);
    if (!umaToDelete) {
      return res.status(404).json({ error: "Uma no encontrada" });
    }
    res.status(200).json({ message: "Uma eliminada" });
  } catch (error) {
    res.status(400).json({ error: "ID invalido o error al eliminar" });
  }
});

module.exports = umasRouter;
