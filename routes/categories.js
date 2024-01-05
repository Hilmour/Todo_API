var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var db = require("../models");
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);
var isAuth = require("../middleware/middleware");

router.use(isAuth);
router.use(jsend.middleware);

// GET all categories
router.get("/", isAuth, async function (req, res, next) {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Authenticated user GET the list of all categories."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const userId = req.user;
    var todos = await categoryService.getAll(userId);
    return res.jsend.success({ statusCode: 200, result: todos });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Add a new category for the logged in user
router.post("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = "A authenticated user is able to add a new cateogry."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  const { name } = req.body;
  if (name == null) {
    return res.jsend.fail({ statusCode: 400, email: "Name is required." });
  }
  try {
    const userId = req.user;
    const { name } = req.body;
    await categoryService.create(name, userId);
    return res.jsend.success({ statusCode: 200, result: name });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Change/update a specific category for logged in user
router.put("/:id", isAuth, jsonParser, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = "A authenticated user is able to change/update a category name."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  const { name } = req.body;
  if (name == null) {
    return res.jsend.fail({ statusCode: 400, email: "Name is required." });
  }
  try {
    const categoryId = req.params.id;
    const userId = req.user;
    const { name } = req.body;

    await categoryService.update(categoryId, name, userId);

    return res.jsend.success({
      statusCode: 200,
      result: "Category successfully updated",
    });
  } catch (error) {
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

// Delete a specific todo if for the logged in user
router.delete("/:id", isAuth, jsonParser, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Deletes a category from the :id parameters provided in the endpoint."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  // #swagger.responses = [500]
  try {
    const categoryId = req.params.id;
    const userId = req.user;
    await categoryService.delete(categoryId, userId);
    return res.jsend.success({
      statusCode: 200,
      result: "Category successfully deleted",
    });
  } catch (error) {
    return res.jsend.error({ statusCode: 500, message: error.message });
  }
});

module.exports = router;
