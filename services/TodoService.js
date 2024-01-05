const { Op } = require("sequelize");

class TodoService {
  constructor(db) {
    this.client = db.sequelize;
    this.Todo = db.Todo;
  }
  
  // Create a Todo
  async create(name, description, categoryId, statusId, userId) {
    return this.Todo.create({
      Name: name,
      Description: description,
      CategoryId: categoryId,
      StatusId: statusId,
      UserId: userId,
    },
    ).catch(function (err) {
      console.log(err);
    });
  }

   // Get all todos and deleted todos items
  async getAllTodos(userId) {
    return this.Todo.findAll({
      where: { UserId: userId },
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Update a todo
  async update(id, name, description, categoryId, statusId, userId) {
    try {
      const [updatedRows] = await this.Todo.update(
        {
          Name: name,
          Description: description,
          CategoryId: categoryId,
          StatusId: statusId,
        },
        {
          where: {
            Id: id,
            UserId: userId,
          },
        }
      );

      if (updatedRows === 0) {
        throw new Error("Todo not found or you don't have permission to update it.");
      }

      return updatedRows;
    } catch (error) {
      throw error;
    }
  }

   // Get all todos with the deleted status
  async getDeletedTodos(userId) {
    return this.Todo.findAll({
      where: {
        UserId: userId,
        StatusId: 4,
      },
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Get all todos without the deleted status
  async getTodosWithoutDeleted(userId) {
    return this.Todo.findAll({
      where: {
        UserId: userId,
        StatusId: {
          [Op.not]: 4,
        },
      },
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Change todo status to deleted
  async delete(id, userId) {
    try {
      const updatedTodo = await this.Todo.update(
        { StatusId: 4 },
        {
          where: { Id: id, UserId: userId },
        }
      );

      if (updatedTodo[0] === 0) {
        throw new Error(
          "Todo not found or you don't have permission to delete it."
        );
      }

      return updatedTodo;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodoService;
