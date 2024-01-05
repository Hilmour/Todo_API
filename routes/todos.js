var express = require("express");
var router = express.Router();
var jsend = require("jsend");
const isAuth = require("../middleware/middleware");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var db = require("../models");
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);
var TodoService = require("../services/TodoService");
var todoService = new TodoService(db);

router.use(isAuth);
router.use(jsend.middleware);

/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "Authenticated users can GET the list of all todo items which dont have deleted status."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const todos = await todoService.getTodosWithoutDeleted(req.user);
    return res.jsend.success({ statusCode: 200, result: todos });
  } catch (error) {
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Return all the users todos including todos with a deleted status
router.get("/all", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "Authenticated user can GET the list of all todo items including items with a deleted status."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const todos = await todoService.getAllTodos(req.user);
    return res.jsend.success({ statusCode: 200, result: todos });
  } catch (error) {
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Return all the todos with the deleted status
router.get("/deleted", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "Authenticated users can GET the list of all todo items with a deleted status."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const deletedTodos = await todoService.getDeletedTodos(req.user);
    return res.jsend.success({ statusCode: 200, result: deletedTodos });
  } catch (error) {
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Add a new todo with their category for the logged in user
router.post("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "Authenticated users can add a new todo item."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  const { name, description, categoryId, statusId } = req.body;
  if (
    name == null ||
    description == null ||
    categoryId == null ||
    statusId == null
  ) {
    return res.jsend.fail({
      statusCode: 400,
      email: "One or more fields is required.",
    });
  }
  try {
    const categoryId = req.body.categoryId;
    const statusId = req.body.statusId;
    const userId = req.user;
    const { name, description } = req.body;
    const addedTodos = await todoService.create(
      name,
      description,
      categoryId,
      statusId,
      userId
    );
    return res.jsend.success({ statusCode: 200, result: addedTodos });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ statusCode: 400, message: error.message });
  }
});

// GET all statuses
router.get("/statuses", isAuth, async function (req, res, next) {
  // #swagger.tags = ['Statuses']
  // #swagger.description = "Authenticated user GET the list of all statuses."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const statuses = await statusService.getAllStatuses();
    return res.jsend.success({ statusCode: 200, result: statuses });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Change/update a specific todo for logged in user
router.put("/:id", isAuth, jsonParser, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "A authenticated user is able to change/update a category name."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  const { name, description, categoryId, statusId } = req.body;
  if (
    name == null ||
    description == null ||
    categoryId == null ||
    statusId == null
  ) {
    return res.jsend.fail({
      statusCode: 400,
      email: "One or more fields is required.",
    });
  }
  try {
    const userId = req.user;
    const todoId = req.params.id;
    const { name, description, categoryId, statusId } = req.body;

    await todoService.update(
      todoId,
      name,
      description,
      categoryId,
      statusId,
      userId
    );
    return res.jsend.success({
      statusCode: 200,
      result: "Todo successfully updated",
    });
  } catch (error) {
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Delete a specific todo if for the logged in user
router.delete("/:id", isAuth, jsonParser, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = "Authenticated users can delete Todo items based on parameters provided in the request's endpoint."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const todoId = req.params.id;
    const userId = req.user;
  
    await todoService.delete(todoId, userId);
    return res.jsend.success({
      statusCode: 200,
      result: "Todo successfully deleted",
    });
  } catch (error) {
    return res.jsend.error({ statusCode: 400, message: error.message });
  }
});

module.exports = router;