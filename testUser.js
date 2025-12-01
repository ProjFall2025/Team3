// testUser.js
const knex = require('./api/config/database');

async function getUserById(id) {
  try {
    const id = "a45cbdc7-21b1-466b-849f-af9cd297330d";

    const user = await knex('users')
      .select('id','username','email','bio','password','is_admin','num_failed_attempts','is_locked','created_at')
      .where({ id, deleted: false })
      .first();

    console.log("User:", user);
  } catch (err) {
    console.error("Error fetching user:", err);
  } finally {
    await knex.destroy(); // close DB connection
  }
}

// Replace with the ID you want to test
const idToTest = 1;

getUserById(idToTest);
