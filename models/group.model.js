const db = require('../config/db');

class Group {
  static async assignNumber(userId, number) {
    await db.execute(
      'INSERT INTO user_numbers (user_id, number) VALUES (?, ?)',
      [userId, number]
    );
  }

  static async getGroupMembers(number) {
    const [rows] = await db.execute(
      'SELECT u.display_name FROM users u JOIN user_numbers un ON u.id = un.user_id WHERE un.number = ?',
      [number]
    );
    return rows;
  }
}

module.exports = Group;
