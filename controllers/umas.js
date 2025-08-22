const umasRouter = require("express").Router();
const Uma = require("../models/uma");

//Obtener todas las umas de la BD
umasRouter.get("/", async (req, res) => {
  try {
    const umas = await Uma.find({});
    res.status(200).json(umas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las umas" });
  }
});

//Obtener una uma por ID
umasRouter.get("/:id", async (req, res) => {
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
umasRouter.post("/", async (req, res) => {
  try {
    const body = req.body;

    const uma = new Uma({
      name: body.name,
      hair_color: body.hair_color,
      eye_color: body.eye_color,
      height: body.height,
      avatar: body.avatar,
    });

    const savedUma = await uma.save();
    res.status(201).json(savedUma);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la uma" });
  }
});

//Editar una uma por id
umasRouter.put("/:id", async (req, res) => {
  try {
    const body = req.body;
    const uma = new Uma({
      name: body.name,
      hair_color: body.hair_color,
      eye_color: body.eye_color,
      height: body.height,
      avatar: body.avatar,
    });

    const updatedUma = await Uma.findByIdAndUpdate(req.params.id, uma, {
      new: true,
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
umasRouter.delete("/:id", async (req, res) => {
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
