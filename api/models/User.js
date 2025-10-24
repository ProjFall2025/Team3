const pool = require('../config/database');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();

class User {
  static async getById(id) {
    const result = await pool.query(
      'select id, username, email, bio, password, is_admin, num_failed_attempts, is_locked, created_at from users where id = $1 and deleted = false',
      [id]
    );
    return result.rows[0];
  }

  static async getByUsername(username) {
    const result = await pool.query(
      'select id, username, email, bio, password, is_admin, num_failed_attempts, is_locked, created_at from users where username = $1 and deleted = false',
      [username]
    );
    return result.rows[0];
  }

  static async getByEmail(email) {
    const result = await pool.query(
      'select id, username, email, bio, password, is_admin, num_failed_attempts, is_locked, created_at from users where email = $1 and deleted = false',
      [email]
    );
    return result.rows[0];
  }

  static async follow(follower, followee) {
    const result = await pool.query(
      'insert into user_follows (follower, followee) VALUES ($1, $2) returning *',
      [follower, followee]
    );
    return result.rows[0];
  }

  static async getFollowing(userId) {
    const result = await pool.query(
      'select u.* from user_follows uf, users u where uf.followee = $1 and uf.follower = u.id',
      [userId]
    );
    return result.rows;
  }

  static async getSheets(userId) {
    const result = await pool.query('select * from sheets where created_by = $1', [userId]);
    return result.rows;
  }

  static async getComments(userId) {
    const result = await pool.query('select * from comments where created_by = $1', [userId]);
    return result.rows;
  }

  static async logAttempt(id, succeeded, ip_address){
    const result = await pool.query('insert into login_attempts (user_id, succeeded, ip_address) values ($1, $2, $3)', [id, succeeded, ip_address])
    return result.rows[0];
  }

  static async updateLastLoggedIn(id, date){
    const result = await pool.query(`update users set last_logged_in = $2 where id = $1`, [id, date]);
    return result.rows[0];
  }

  static async create(userData){
    const {username, email, password, bio} = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'insert into users (username, email, password, bio) values ($1, $2, $3, $4) returning id, username, email, bio',
      [username, email, hashedPassword, bio || '']
    );
    
    return result.rows[0];
  }

  static async update(id, userData) {
    const { username, email, password, bio } = userData;
    const result = await pool.query(
      'update users set username = $1, email = $2, password = $3, bio = $4 where id = $5 and deleted = false returning *',
      [username, email, password, bio, id]
    );
    return result.rows[0];
  }

  static async makeAdmin(id) {
    const result = await pool.query('update users set is_admin = true where id = $1 and deleted = false returning *', [id]);
    return result.rows[0];
  }

  static async restore(id) {
    const result = await pool.query('update users set deleted = false where id = $1 returning *', [id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('delete from users where id = $1 returning *', [id]);
    return result.rows[0];
  }

  static genToken(id){
    const token = jwt.sign(
            { userId: id },
            process.env.JWT_SECRET || 'dev_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
          );
    return token;
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;