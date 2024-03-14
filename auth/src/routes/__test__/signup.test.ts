import request from "supertest";
import { app } from "../../app";

it("returns 201 after successfull signup", async () => {
  return request(app)
    .post("/api/sers/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});
