class Calorie
{
  constructor(db)
  {
    this.db = db;
  }

  // Add a calorie entry
  add(userId, amount, timestamp)
  {
    return this.db.run(
      `INSERT INTO calories (user_id, amount, timestamp) VALUES (?, ?, ?)`,
      [userId, amount, timestamp]
    );
  }

  // Get total calories for a user on a specific date
  getTodayTotal(userId, dateStr)
  {
    return this.db.get(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM calories WHERE user_id = ? AND date(timestamp) = ?`,
      [userId, dateStr]
    );
  }

  // Get calorie entries for a user on a specific date
  getEntriesForDate(userId, dateStr)
  {
    return this.db.all(
      `SELECT id, user_id AS userId, amount, timestamp
       FROM calories
       WHERE user_id = ? AND date(timestamp) = ?
       ORDER BY timestamp DESC`,
      [userId, dateStr]
    );
  }


  // Get recent calorie entries for a user
  getRecentEntries(userId)
  {
    return this.db.all(
      `SELECT id, user_id AS userId, amount, timestamp
       FROM calories
       WHERE user_id = ?
       ORDER BY timestamp DESC
       LIMIT 30`,
      [userId]
    );
  }

  // Delete a calorie entry by ID
  delete(id)
  {
    return this.db.run(`DELETE FROM calories WHERE id = ?`, [id]);
  }

  // Get a calorie entry by ID
  getById(id)
  {
    return this.db.get(
      `SELECT id, user_id AS userId, amount, timestamp
       FROM calories
       WHERE id = ?`,
      [id]
    );
  }

  // Get calorie history for a user over the past N days
  getHistory(userId, days)
  {
    return this.db.all(
      `SELECT date(timestamp) AS date, COALESCE(SUM(amount),0) AS total
       FROM calories
       WHERE user_id = ? AND date(timestamp) >= date('now', ? || ' days')
       GROUP BY date(timestamp)
       ORDER BY date(timestamp) DESC
       LIMIT ?`,
      [userId, `-${days - 1}`, days]
    );
  }
}


// Export the Calorie class
module.exports = Calorie;
