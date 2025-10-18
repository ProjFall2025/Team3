const pool = require('../config/database');

class Comment {
  static async getById(id) {
    const result = await pool.query('select * from comments where id = $1 and deleted = false', [id]);
    return result.rows[0];
  }

  static async create(commentData) {
    const { sheet, created_by, content } = commentData;
    const result = await pool.query(
      'insert into comments (sheet, created_by, content) values ($1, $2, $3) returning *',
      [sheet, created_by, content]
    );
    return result.rows[0];
  }

  static async like({ user_id, comment_id }) {
    const result = await pool.query(
      'insert into comment_likes (user_id, comment_id) values ($1, $2) returning *',
      [user_id, comment_id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'delete from comments where id = $1 returning *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Comment;