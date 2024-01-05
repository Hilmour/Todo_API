class CategoryService {
  constructor(db) {
    this.client = db.sequelize;
    this.Category = db.Category;
    this.Todo = db.Todo;
  }
  async getAll(userId) {
    return this.Category.findAll({
      where: {UserId: userId},
    }).catch(function (err) {
      console.log(err);
    });
  }

  // Create a category
  async create(name, userId) {
    try {
      const existingCategory = await this.Category.findOne({
        where: {
          Name: name,
          UserId: userId,
        },
      });

      if (existingCategory) {
        throw new Error("Category item already exists.");
      }

      const newCategory = await this.Category.create({
        Name: name,
        UserId: userId,
      });

      return newCategory;
    } catch (error) {
      throw error;
    }
  }

   // Update a category
  async update(id, name, userId) {
    return this.Category.update(
      { Name: name },
      {
        where: {
          Id: id,
          UserId: userId,
        },
      }
    ).catch(function (err) {
      console.log(err);
    });
  }

   // Delete category if not assinged to a todo item, otherwise, throw an error
  async delete(id, userId) {
    const category = await this.Category.findOne({
      where: { Id: id, UserId: userId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const todosCount = await this.Todo.count({
      where: { CategoryId: id },
    });

    if (todosCount > 0) {
      throw new Error(
        "Category cannot be deleted as it is assigned to one or more todo items"
      );
    }

    await category.destroy();
    return "Category successfully deleted";
  }
}
module.exports = CategoryService;
