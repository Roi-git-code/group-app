const db = require('../config/db');

class User {
  static async create(userData) {
    const [result] = await db.execute(
      `INSERT INTO users 
       (first_name, middle_name, last_name, email, password) 
       VALUES (?, ?, ?, ?, ?)`,  // Added middle_name
      [
        userData.firstName,
        userData.middleName || null,  // Handle optional middle name
        userData.lastName,
        userData.email,
        userData.password
      ]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT id, first_name, middle_name, last_name, email FROM users WHERE email = ?', 
      [email]
    );
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.execute(
      `SELECT 
        id, 
        CONCAT(
          first_name, 
          IF(middle_name IS NULL, ' ', CONCAT(' ', middle_name, ' ')), 
          last_name
        ) AS full_name 
       FROM users`
    );
    return rows;
  }
}
  module.exports =User;
