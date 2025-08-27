//Voy a crear tests para:
//Token invalido
//Crear una uma correctamente
//Obtener la info de las umas de un usuario
//Obtener la info de una uma por id
//Editar una uma
//Eliminar una uma
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import User from "../models/user";
import Uma from "../models/uma";
import bcrypt from "bcrypt";
import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";

const api = supertest(app);

describe("Tests para Umas", () => {
  let token;
  let userId;
  let uma;

  beforeEach(async () => {
    await User.deleteMany({});
    await Uma.deleteMany({});

    const passwordHash = await bcrypt.hash("secret123", 10);
    const user = new User({ username: "testuserumas", passwordHash });
    await user.save();
    userId = user._id.toString();

    const loginResponse = await api
      .post("/api/login")
      .send({ username: "testuserumas", password: "secret123" });
    token = loginResponse.body.token;

    uma = {
      name: "Test",
      hair_color: "Brown",
      eye_color: "Red",
      height: "165",
      avatar: "TestAvatar",
      user: userId,
    };
  });

  it("Token invalido al crear una Uma", async () => {
    const response = await api
      .post("/api/umas")
      .set("Authorization", `Bearer token_invalido`)
      .send(uma);

    expect(response.status).toBe(401);
  });

  it("Crear una uma correctamente", async () => {
    const response = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    expect(response.status).toBe(201);
  });

  it("Editar una uma correctamente", async () => {
    const createResponse = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    const createdUma = createResponse.body;

    const umaEditada = {
      ...createdUma,
      name: "Editada",
    };

    const editResponse = await api
      .put(`/api/umas/${createdUma.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(umaEditada);

    expect(editResponse.status).toBe(200);
    expect(editResponse.body.name).toBe("Editada");
  });

  it("Editar una uma incorrectamente", async () => {
    const createResponse = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    const createdUma = createResponse.body;

    const umaEditada = {
      ...createdUma,
      name: "Editada",
    };

    const editResponse = await api
      .put(`/api/umas/idIncorrecto`)
      .set("Authorization", `Bearer ${token}`)
      .send(umaEditada);

    expect(editResponse.status).toBe(400);
    expect(editResponse.body.error).toBe("ID invalido o error al actualizar");
  });

  it("Eliminar una uma correctamente", async () => {
    const createResponse = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    const createdUma = createResponse.body;

    const deleteResponse = await api
      .delete(`/api/umas/${createdUma.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
  });

  it("Eliminar una uma incorrectamente", async () => {
    const createResponse = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    const deleteResponse = await api
      .delete(`/api/umas/idIncorrecto`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(400);
    expect(deleteResponse.body.error).toBe("ID invalido o error al eliminar");
  });

  it("Obtener info de una Uma por Id", async () => {
    const createResponse = await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    const createdUmaId = createResponse.body.id;

    const getOneResponse = await api
      .get(`/api/umas/${createdUmaId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getOneResponse.status).toBe(200);
    expect(getOneResponse.body.name).toBe("Test");
  });

  it("Obtener las umas de un usuario", async () => {
    //Agrego 2 umas
    await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    await api
      .post("/api/umas")
      .set("Authorization", `Bearer ${token}`)
      .send(uma);

    const getAllResponse = await api
      .get(`/api/umas`)
      .set("Authorization", `Bearer ${token}`);

    expect(getAllResponse.status).toBe(200);
    expect(getAllResponse.body.length).toBe(2); //Checkeo que la longitud del array de umas que me retorna sea 2
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
