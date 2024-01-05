module.exports = (sequelize, Sequelize) => {
	const Todo = sequelize.define('Todo', {
		Name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false
		},
		Description: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false
		}
	},{
		timestamps: false
	});

  Todo.associate = function (models) {
    Todo.belongsTo(models.Category, { foreignKey: { allowNull: false } });
    Todo.belongsTo(models.Status, { foreignKey: { allowNull: false } });
  };

  return Todo;
};
