import supertest from "supertest";
import { server } from "../server";
import { clearDB } from "../database/users";

const request = supertest(server);

afterAll(() => {
  server.close();
});

describe("Integration test API", () => {
  afterEach(() => {
    clearDB();
  });

  test("positive scenario", async () => {
    const response1 = await request.get("/api/users");
    expect(response1.status).toBe(200);
    expect(response1.body).toEqual([]);

    const newUser = { username: "Ivan", age: 10, hobbies: ["chess"] };
    const response2 = await request.post("/api/users").send(newUser);
    expect(response2.status).toBe(201);
    expect(response2.body).toEqual(expect.objectContaining(newUser));

    const newUserId = response2.body.id;
    const response3 = await request.get(`/api/users/${newUserId}`);
    expect(response3.status).toBe(200);
    expect(response3.body).toEqual({ id: newUserId, ...newUser });

    const updatedUser = {
      username: "Dmitry",
      age: 15,
      hobbies: ["football", "hokey"],
    };
    const response4 = await request
      .put(`/api/users/${newUserId}`)
      .send(updatedUser);
    expect(response4.status).toBe(200);
    expect(response4.body).toEqual({ id: newUserId, ...updatedUser });

    const response5 = await request.delete(`/api/users/${newUserId}`);
    expect(response5.status).toBe(204);

    const response6 = await request.get(`/api/users/${newUserId}`);
    expect(response6.status).toBe(404);
    expect(response6.body).toEqual("Not found");
  });

  test("negative scenario", async () => {
    const response1 = await request.get("/wrong/url");
    expect(response1.status).toBe(404);
    expect(response1.body).toEqual("Not found");

    const newUserWithoutRequiredField = { username: "Ivan", age: 10 };
    const response2 = await request
      .post("/api/users")
      .send(newUserWithoutRequiredField);
    expect(response2.status).toBe(400);
    expect(response2.body).toEqual("Invalid request data");

    const newUserWithWrongFieldType = {
      username: "Ivan",
      age: "10",
      hobbies: ["chess"],
    };
    const response3 = await request
      .post("/api/users")
      .send(newUserWithWrongFieldType);
    expect(response3.status).toBe(400);
    expect(response3.body).toEqual("Invalid request data");

    const response4 = await request
      .post("/api/users")
      .send({ username: "Ivan", age: 10, hobbies: ["chess"] });
    expect(response4.status).toBe(201);

    const response5 = await request.get(`/api/users/no-uuid-at-all`);
    expect(response5.status).toBe(400);
    expect(response5.body).toEqual("Invalid request data");

    const fakeUUID = "550e8400-e29b-41d4-a716-446655440000";
    const response6 = await request.get(`/api/users/${fakeUUID}`);
    expect(response6.status).toBe(404);
    expect(response6.body).toEqual("Not found");
  });

  test("tricky scenario", async () => {
    const response1 = await request.get("/api/users");
    expect(response1.status).toBe(200);
    expect(response1.body).toEqual([]);

    const response2 = await request.post("/api/users");
    expect(response2.status).toBe(400);

    const newUser = {
      username: "Ivan",
      age: 10,
      hobbies: ["chess"],
      someExtraField: "should not be stored in DB",
    };
    const response3 = await request.post("/api/users").send(newUser);
    expect(response3.status).toBe(201);

    const response4 = await request.get("/api/users");
    expect(response4.status).toBe(200);
    expect(response4.body).toEqual([
      {
        id: response3.body.id,
        username: "Ivan",
        age: 10,
        hobbies: ["chess"],
      },
    ]);

    const response5 = await request.patch("/api/users");
    expect(response5.status).toBe(405);
    expect(response5.body).toEqual("Method not allowed");
  });
});
