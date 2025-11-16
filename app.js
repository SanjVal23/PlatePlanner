const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dayjs = require('dayjs');

const { init } = require('./db');


const PORT = process.env.PORT || 5000;

async function main()
{
  const db = await init();

  const app = express();

  
  app.use(cors());

  app.use(bodyParser.json());

  // Helper to get date string
  function toDateStr(ts = null) {
    return ts ? dayjs(ts).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
  }

  //add calorie entry
  app.post('/api/calories/add', async (req, res) => {
    try {
      const { userId, amount, timestamp } = req.body;
      if (typeof userId !== 'number' || typeof amount !== 'number') {
        return res.status(400).json({ error: 'userId and amount must be numbers' });
      }

      // Use provided timestamp or now
      const ts = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

      await db.run(
        `INSERT INTO calories (user_id, amount, timestamp) VALUES (?, ?, ?)`,
        [userId, amount, ts]
      );

      // return today's total after insert
      const today = toDateStr(ts);
      const row = await db.get(
        `SELECT COALESCE(SUM(amount), 0) as total FROM calories WHERE user_id = ? AND date(timestamp) = ?`,
        [userId, today]
      );

      res.json({ message: 'Calorie added', totalToday: row.total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //get total calories for the day
  app.get('/api/calories/today', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId, 10);


      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: 'userId query parameter required' });
      }

      const today = toDateStr();

      const row = await db.get(
        `SELECT COALESCE(SUM(amount), 0) as total FROM calories WHERE user_id = ? AND date(timestamp) = ?`,
        [userId, today]
      );

      res.json({ date: today, total: row.total });
    } 
    
    catch (err) {
      console.error(err);

      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //get the calorie entries for a user, optionally filtered by date
  app.get('/api/calories', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId, 10);
      if (Number.isNaN(userId)) return res.status(400).json({ error: 'userId query parameter required' });


      const date = req.query.date; // expected YYYY-MM-DD
      if (date) {
        const rows = await db.all(
          `SELECT id, user_id as userId, amount, timestamp FROM calories WHERE user_id = ? AND date(timestamp) = ? ORDER BY timestamp DESC`,
          [userId, date]
        );

        const totalRow = await db.get(
          `SELECT COALESCE(SUM(amount), 0) as total FROM calories WHERE user_id = ? AND date(timestamp) = ?`,
          [userId, date]
        );
        return res.json({ date, entries: rows, total: totalRow.total });
      } else {
        const rows = await db.all(
          `SELECT id, user_id as userId, amount, timestamp FROM calories WHERE user_id = ? ORDER BY timestamp DESC LIMIT 30`,
          [userId]
        );
        return res.json({ entries: rows });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //Delete calorie entry
  app.delete('/api/calories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      // Find the entry first to get userId and timestamp
      const entry = await db.get(`SELECT id, user_id as userId, amount, timestamp FROM calories WHERE id = ?`, [id]);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });

      await db.run(`DELETE FROM calories WHERE id = ?`, [id]);

      const today = toDateStr(entry.timestamp);
      const row = await db.get(
        `SELECT COALESCE(SUM(amount), 0) as total FROM calories WHERE user_id = ? AND date(timestamp) = ?`,
        [entry.userId, today]
      );

      res.json({ message: 'Entry deleted', totalToday: row.total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //Get calorie history for last N days
  app.get('/api/calories/history', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId, 10);
      const days = parseInt(req.query.days || '7', 10);
      if (Number.isNaN(userId)) return res.status(400).json({ error: 'userId required' });
      if (Number.isNaN(days) || days <= 0) return res.status(400).json({ error: 'days must be a positive integer' });

      //date and timezone safe way to get last N days totals
      const rows = await db.all(
        `SELECT date(timestamp) as date, COALESCE(SUM(amount),0) as total
         FROM calories
         WHERE user_id = ? AND date(timestamp) >= date('now', ? || ' days')
         GROUP BY date(timestamp)
         ORDER BY date(timestamp) DESC
         LIMIT ?`,
        [userId, `-${days - 1}`, days]
      );

      res.json({ days: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.listen(PORT, () => {
    console.log(`✅ Calorie tracker API listening on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error('Failed to start app', err);
  process.exit(1);
});
