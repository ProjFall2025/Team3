const knex = require('../config/database');

class Model {
  static async getAll() {
    return await knex('models').select('*');
  }
}

module.exports = Model;