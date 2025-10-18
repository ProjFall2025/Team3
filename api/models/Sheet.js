const pool = require('../config/database');

class Sheet {
  static async create(sheetData) {
    const { created_by, model, title, artist, description, instrument, visibility } = sheetData;
    const result = await pool.query(
      'insert into sheets (created_by, model, title, artist, description, instrument, visibility) values ($1, $2, $3, $4, $5, $6, $7) returning *',
      [created_by, model, title, artist, description || '', instrument, visibility || 'public']
    );
    return result.rows[0];
  }

  static async rate({ user_id, sheet_id, rating }) {
    const result = await pool.query(
      'insert into sheet_ratings (user_id, sheet_id, rating) values ($1, $2, $3) returning *',
      [user_id, sheet_id, rating]
    );
    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query(
      'select * from sheets where id = $1 and deleted = false',
      [id]
    );
    return result.rows[0];
  }

  static async getComments(sheetId) {
    const result = await pool.query(
      'select * from comments where sheet = $1 and deleted = false',
      [sheetId]
    );
    return result.rows;
  }

  static async getAverages() {
    const result = await pool.query(
      'select * from sheets_with_rating where deleted = false'
    );
    return result.rows;
  }

  static async topTenDownloads() {
    const result = await pool.query(
      'select * from ten_sheets_by_downloads where deleted = false'
    );
    return result.rows;
  }

  static async topTenAverages() {
    const result = await pool.query(
      'select * from ten_sheets_by_rating where deleted = false'
    );
    return result.rows;
  }

  static async update(id, updateData) {
    const { title, artist, description, instrument, visibility } = updateData;
    const result = await pool.query(
      'update sheets set title = $1, artist = $2, description = $3, instrument = $4, visibility = $5 where id = $6 and deleted = false returning *',
      [title, artist, description, instrument, visibility, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'delete from sheets where id = $1 returning *',
      [id]
    );
    return result.rows[0];
  }

  // TODO: Add a route for getting sheets from sheets_minimal (for searching)
}

module.exports = Sheet;