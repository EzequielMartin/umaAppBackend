//Voy a crear tests para:
//Token invalido
//Crear una uma correctamente
//Obtener la info de las umas de un usuario
//Obtener la info de una uma por id
//Editar una uma
//Eliminar una uma
import { describe, it, beforeAll, expect } from "vitest";
import User from "../models/user";
import Uma from "../models/uma";
import bcrypt from "bcrypt";
import app from "../app";
import supertest from "supertest";

const api = supertest(app);

describe("Tests para Umas", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("secret123", 10);
    const user = new User({ username: "testuser", passwordHash });
    await user.save();
    userId = user._id.toString();

    await Uma.deleteMany({});

    const loginResponse = await api
      .post("/api/login")
      .send({ username: "testuser", password: "secret123" });
    token = loginResponse.body.token;
  });

  it("Token invalido al crear una Uma", async () => {
    const uma = new Uma({
      name: "Test",
      hair_color: "Brown",
      eye_color: "Red",
      height: "165",
      avatar: "TestAvatar",
      user: userId,
    });

    const response = await api
      .post("/api/umas")
      .set("Authorization", `Bearer token_invalido`)
      .send(uma);

    expect(response.status).toBe(401);
  });

  it("Crear una uma correctamente", async () => {
    const uma = new Uma({
      name: "Test",
      hair_color: "Brown",
      eye_color: "Red",
      height: "165",
      avatar: "TestAvatar",
      user: userId,
    });

    const response = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    expect(response.status).toBe(201);
  });

  it("Editar una uma correctamente", async () => {
    //TODO, pasarle un id correcto
  });

  it("Editar una uma incorrectamente", async () => {
    //TODO, pasarle un id erroneo
  });

  it("Eliminar una uma correctamente", async () => {
    //TODO, pasarle un id correcto
  });

  it("Eliminar una uma incorrectamente", async () => {
    //TODO, pasarle un id incorrecto
  });
});
