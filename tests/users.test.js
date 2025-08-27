//Voy a implementar tests para:
//Creacion de usuario
//Obtener toda la lista de usuarios
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import User from "../models/user";
import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";

const api = supertest(app);

describe("Tests para usuarios", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("Creacion de usuario correcta", async () => {
    const createUserResponse = await api
      .post("/api/users")
      .send({ username: "testusercreation", password: "password" });

    expect(createUserResponse.status).toBe(201);
  });

  it("Creacion de usuario incorrecta, username duplicado", async () => {
    await api
      .post("/api/users")
      .send({ username: "testuserduplicado", password: "password" });

    const createUserResponse = await api
      .post("/api/users")
      .send({ username: "testuserduplicado", password: "password" });

    expect(createUserResponse.status).toBe(400);
    expect(createUserResponse.body.error).toBe("El username ya esta en uso");
  });

  it("Obtener toda la lista de usuarios", async () => {
    //Agrego 2 usuarios
    await api
      .post("/api/users")
      .send({ username: "testuserlista", password: "password" });

    await api
      .post("/api/users")
      .send({ username: "testuserlista2", password: "password" });

    const listaUsuarios = await api.get("/api/users");

    expect(listaUsuarios.body.length).toBe(2);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
