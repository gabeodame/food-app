import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

const bufferModule = require("buffer") as {
  Buffer: typeof Buffer;
  SlowBuffer?: typeof Buffer;
};

if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}

const { app } = require("../app") as typeof import("../app");

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer | null = null;

beforeAll(async () => {
  process.env.JWT_KEY = "dfdfdfadfdfdff";

  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI, {});
    return;
  }

  mongo = await MongoMemoryServer.create({
    instance: { ip: "127.0.0.1" },
  });
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
