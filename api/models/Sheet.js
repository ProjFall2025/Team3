const knex = require('../config/database');

class Sheet {
  static async create(sheetData) {
    const { created_by, model, title, artist, description, instrument, visibility } = sheetData;
    const rows = await knex('sheets')
      .insert({
        created_by,
        model,
        title,
        artist,
        description: description || '',
        instrument,
        visibility: visibility || 'public'
      })
      .returning('*');
    return rows[0];
  }

  static async rate({ user_id, sheet_id, rating }) {
    const rows = await knex('sheet_ratings')
      .insert({ user_id, sheet_id, rating })
      .returning('*');
    return rows[0];
  }

  static async getById(id) {
    return await knex('sheets').where({ id, deleted: false }).first();
  }

  static async getComments(sheetId) {
    return await knex('comments').where({ sheet: sheetId, deleted: false });
  }

  static async getAverages() {
    return await knex.select('*').from('sheets_with_rating').where({ deleted: false });
  }

  static async topTenDownloads() {
    return await knex.select('*').from('ten_sheets_by_downloads').where({ deleted: false });
  }

  static async topTenAverages() {
    return await knex.select('*').from('ten_sheets_by_rating').where({ deleted: false });
  }

  static async update(id, updateData) {
    const { title, artist, description, instrument, visibility } = updateData;
    const rows = await knex('sheets')
      .where({ id, deleted: false })
      .update({ title, artist, description, instrument, visibility })
      .returning('*');
    return rows[0];
  }

  static async delete(id) {
    const rows = await knex('sheets').where({ id }).del().returning('*');
    return rows[0];
  }

  // TODO: Add a route for getting sheets from sheets_minimal (for searching)
}

module.exports = Sheet;