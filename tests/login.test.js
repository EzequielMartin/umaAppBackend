//Voy a implementar tests para:
//Login Correcto
//Usuario no encontrado
//Contraseña incorrecta

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import User from "../models/user";
import bcrypt from "bcrypt";
import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";

const api = supertest(app);

describe("Tests de creacion y login de usuarios", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret123", 10);
    const user = new User({ username: "testuser", passwordHash });
    await user.save();
  });

  it("Crea un nuevo usuario y hace login con este", async () => {
    const users = await User.find({});
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe("testuser");

    const response = await api
      .post("/api/login")
      .send({ username: "testuser", password: "secret123" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe("testuser");
  });

  it("Intenta loguear con un usuario incorrecto", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "usuarioincorrecto", password: "secret123" })
      .expect(401);
    expect(response.body.error).toBe("Usuario incorrecto");
  });

  it("Intenta loguear con una contraseña incorrecta", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: "testuser", password: "contraseniaincorrecta" })
      .expect(401);
    expect(response.body.error).toBe("Contraseña incorrecta");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
