import { afterAll, afterEach, beforeAll, describe, expect, it } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { createApp } from "./app";
import adminModel from "./modules/auth/model";

const app = createApp();

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await adminModel.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Alice", email: "alice@example.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Alice");

    const user = await adminModel.findOne({ email: "alice@example.com" });
    expect(user).not.toBeNull();
  });

  it("should get all users", async () => {
    await new adminModel({ name: "Bob", email: "bob@example.com" }).save();

    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Bob");
  });
});
