const express = require('express');
const dayjs = require('dayjs');

// Export a function that takes db and CalorieModel as parameters
module.exports = (db, CalorieModel) => {
  const router = express.Router();

  
  const Calorie = new CalorieModel(db);

  function toDateStr(ts = null) {
    return ts ? dayjs(ts).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
  }

  // POST /api/calories/add
  router.post('/add', async (req, res) => {
    try {
      const { userId, amount, timestamp } = req.body;
      if (typeof userId !== 'number' || typeof amount !== 'number') {
        return res.status(400).json({ error: 'userId and amount must be numbers' });
      }

      const ts = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
      await Calorie.add(userId, amount, ts);

      const today = toDateStr(ts);
      const row = await Calorie.getTodayTotal(userId, today);

      res.json({ message: 'Calorie added', totalToday: row.total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/calories/today
  router.get('/today', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId, 10);
      if (Number.isNaN(userId)) return res.status(400).json({ error: 'userId query parameter required' });

      const today = toDateStr();
      const row = await Calorie.getTodayTotal(userId, today);

      res.json({ date: today, total: row.total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/calories
  router.get('/', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId, 10);
      if (Number.isNaN(userId)) return res.status(400).json({ error: 'userId query parameter required' });

      const date = req.query.date;

      if (date) {
        const entries = await Calorie.getEntriesForDate(userId, date);
        const totalRow = await Calorie.getTodayTotal(userId, date);

        return res.json({ date, entries, total: totalRow.total });
      }

      const entries = await Calorie.getRecentEntries(userId);
      res.json({ entries });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // DELETE /api/calories/:id
  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const entry = await Calorie.getById(id);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });

      await Calorie.delete(id);

      const today = toDateStr(entry.timestamp);
      const row = await Calorie.getTodayTotal(entry.userId, today);

      res.json({ message: 'Entry deleted', totalToday: row.total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // GET /api/calories/history
  router.get('/history', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId, 10);
      const days = parseInt(req.query.days || '7', 10);

      if (Number.isNaN(userId)) return res.status(400).json({ error: 'userId required' });
      if (Number.isNaN(days) || days <= 0) return res.status(400).json({ error: 'days must be a positive integer' });

      const rows = await Calorie.getHistory(userId, days);

      res.json({ days: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
