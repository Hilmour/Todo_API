class StatusService {
    constructor(db) {
      this.client = db.sequelize;
      this.Status = db.Status;
    }
    async getAllStatuses() {
      return this.Status.findAll({
        where: {},
      }).catch(function (err) {
        console.log(err);
      });
    }
  
  }
  module.exports = StatusService;