module.exports = (sequelize, Sequelize) => {
  const Status = sequelize.define(
    "Status",
    {
      Status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );

  // Function to populate statuses table upon application start
  Status.initStatuses = async () => {
    try {
      const statusValues = ["Not Started", "Started", "Completed", "Deleted"];
      for (const status of statusValues) {
        // Try to find the status, create it if it doesn't exist
        await Status.findOrCreate({
          where: { Status: status },
          defaults: { Status: status },
        });
      }
      console.log("Statuses table populated successfully.");
    } catch (error) {
      console.error("Error populating statuses table:", error);
    }
  };

  // Call the function to populate statuses table
  Status.initStatuses();

  return Status;
};