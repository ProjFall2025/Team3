const pool = require('../config/database');

class Model {
  static async getAll() {
    const result = await pool.query(
      'select * from models',
    );
    return result.rows;
  }
}

module.exports = Model;