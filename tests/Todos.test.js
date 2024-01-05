const request = require("supertest");
const app = require("../app");
const db = require("../models");
const jwt = require("jsonwebtoken");

describe("Todo API Integration Tests", () => {
  let todoId;
  let token;

  beforeAll(async () => {
    await db.sequelize.sync();
    // Enter a valid user's credentials
    const credentials = {
      email: "test@gmail.com",
      password: "0001",
    };
    const response = await request(app).post("/login").send(credentials);
    token = response.body.data.token;

    let todoData = {
      // Enter valid category and status ids from the db record 
      name: "New Todo",
      description: "Description of the new Todo",
      categoryId: 3,
      statusId: 2,
    };
    const todoResponse = await request(app)
      .post("/todos")
      .send(todoData)
      .set("Authorization", "Bearer " + token);

    todoId = todoResponse.body.data.result.id;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("DELETE /todos/:id - Delete the created Todo with valid token", async () => {
    expect(todoId).toBeDefined();
    const response = await request(app)
      .delete(`/todos/${todoId}`)
      .set("Authorization", "Bearer " + token);
    expect(response.body).toEqual({
      status: "success",
      data: {
        statusCode: 200,
        result: "Todo successfully deleted",
      },
    });
  });

  test("POST /login - success", async () => {
    // Enter a valid user's credentials from the db record
    const credentials = {
      email: "test@gmail.com",
      password: "0001",
    };
    const response = await request(app).post("/login").send(credentials);
    token = response.body.data.token;
  });

  test("POST /todos - Add a new Todo with valid token", async () => {
    let todoData = {
      // Enter valid category and status ids from the db record 
      name: "New Todo",
      description: "Description of the new Todo",
      categoryId: 3,
      statusId: 2,
    };
    const response = await request(app)
      .post("/todos")
      .send(todoData)
      .set("Authorization", "Bearer " + token);
    todoId = response.body.data.result.id;
    expect(response.body).toEqual({
      status: "success",
      data: {
        statusCode: 200,
        result: {
          id: todoId,
          Name: "New Todo",
          Description: "Description of the new Todo",
          CategoryId: 3,
          StatusId: 2,
          // Enter valid UserId from the credentials above matching the db record
          UserId: 2,
        },
      },
    });
  });

  test("GET /todos/all - Get all user's Todos with valid token", async () => {
    const response = await request(app)
      .get("/todos/all")
      .set("Authorization", "Bearer " + token);
    token = response.body.token;
    expect(response).toHaveProperty("status");
    expect(response).toHaveProperty("statusCode", 200);
  });

  test("GET /todos - Get Todos without sending JWT token", async () => {
    const response = await request(app).get("/todos");
    expect(response.statusCode).toBe(400);
  });

  test("GET /todos - Get Todos with invalid JWT token", async () => {
    const invalidToken = jwt.sign(
      { id: 123, email: "invalid@test.com" },
      "invalidSecret",
      {
        expiresIn: "1h",
      }
    );
    const response = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(400);
  });
});
