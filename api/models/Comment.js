const knex = require('../config/database');

class Comment {
  static async getById(id) {
    return await knex('comments').where({ id, deleted: false }).first();
  }

  static async create(commentData) {
    const { sheet, created_by, content } = commentData;
    const rows = await knex('comments').insert({ sheet, created_by, content }).returning('*');
    return rows[0];
  }

  static async update(id, content, updated_at) {
    const rows = await knex('comments')
      .where({ id, deleted: false })
      .update({ content, updated_at })
      .returning('*');
    return rows[0];
  }

  static async like({ user_id, comment_id }) {
    const rows = await knex('comment_likes').insert({ user_id, comment_id }).returning('*');
    return rows[0];
  }

  static async unlike({ user_id, comment_id }) {
    const rows = await knex('comment_likes').where({ user_id, comment_id }).del().returning('*');
    return rows[0];
  }

  static async delete(id) {
    const rows = await knex('comments').where({ id }).del().returning('*');
    return rows[0];
  }
}

module.exports = Comment;