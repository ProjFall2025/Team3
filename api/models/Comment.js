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

  static async update(id, updateData) {
    const { content, updated_at } = updateData;
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

  static async delete(id) {
    const rows = await knex('comments').where({ id }).del().returning('*');
    return rows[0];
  }
}

module.exports = Comment;