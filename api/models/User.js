const knex = require('../config/database');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();

class User {
  static async getById(id) {
    return await knex('users')
      .select('id','username','email','bio','password','is_admin','num_failed_attempts','is_locked','created_at')
      .where({ id, deleted: false })
      .first();
  }

  static async getByUsername(username) {
    return await knex('users')
      .select('id','username','email','bio','password','is_admin','num_failed_attempts','is_locked','created_at')
      .where({ username, deleted: false })
      .first();
  }

  static async getByEmail(email) {
    return await knex('users')
      .select('id','username','email','bio','password','is_admin','num_failed_attempts','is_locked','created_at')
      .where({ email, deleted: false })
      .first();
  }

  static async follow(follower, followee) {
    const rows = await knex('user_follows').insert({ follower, followee }).returning('*');
    return rows[0];
  }

  static async getFollowing(userId) {
    return await knex('user_follows as uf')
      .join('users as u', 'uf.follower', 'u.id')
      .select('u.*')
      .where('uf.followee', userId);
  }

  static async getFollowers(userId) {
    return await knex('user_follows as uf')
      .join('users as u', 'uf.followee', 'u.id')
      .select('u.*')
      .where('uf.follower', userId);
  }

  static async getSheets(userId) {
    return await knex('sheets').where('created_by', userId);
  }

  static async getComments(userId) {
    return await knex('comments').where('created_by', userId);
  }

  static async logAttempt(id, succeeded, ip_address){
    await knex('login_attempts').insert({ user_id: id, succeeded, ip_address });
  }

  static async updateLastLoggedIn(id, date){
    await knex('users').where({ id }).update({ last_logged_in: date });
  }

  static async create(userData){
    const {username, email, password, bio} = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const rows = await knex('users')
      .insert({ username, email, password: hashedPassword, bio: bio || '' })
      .returning(['id','username','email','bio']);
    return rows[0];
  }

  // MARK: Note - when calling, pass the existing value for fields that are not modified.
  static async update(id, userData) {
    const { username, email, password, bio } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const rows = await knex('users')
      .where({ id, deleted: false })
      .update({ username, email, password: hashedPassword, bio })
      .returning('*');
    return rows[0];
  }

  static async makeAdmin(id) {
    const rows = await knex('users').where({ id, deleted: false }).update({ is_admin: true }).returning('*');
    return rows[0];
  }

  static async unlock(id) {
    const rows = await knex('users').where({ id, deleted: false }).update({ num_failed_attempts: 0, is_locked: false }).returning('*');
    return rows[0];
  }

  static async restore(id) {
    const rows = await knex('users').where({ id }).update({ deleted: false }).returning('*');
    return rows[0];
  }

  static async delete(id) {
    const rows = await knex('users').where({ id }).del().returning('*');
    return rows[0];
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