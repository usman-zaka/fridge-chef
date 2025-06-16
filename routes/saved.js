// routes/saved.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get user's ID based on email
async function getUserId(email) {
  return new Promise((resolve, reject) => {
    db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0].user_id);
    });
  });
}

// Add recipe to saved list
router.post('/add', async (req, res) => {
  const { email, recipe_id, recipe_title, image_url } = req.body;
  try {
    const user_id = await getUserId(email);
    if (!user_id) return res.status(404).json({ error: 'User not found' });

    const sql = `
      INSERT INTO saved_recipes (user_id, recipe_id, recipe_title, image_url)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP
    `;
    db.query(sql, [user_id, recipe_id, recipe_title, image_url], (err) => {
      if (err) return res.status(500).json({ error: 'DB error', detail: err });
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', detail: err });
  }
});

// Remove from saved list
router.post('/remove', async (req, res) => {
  const { email, recipe_id } = req.body;
  try {
    const user_id = await getUserId(email);
    if (!user_id) return res.status(404).json({ error: 'User not found' });

    db.query(
      'DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?',
      [user_id, recipe_id],
      (err) => {
        if (err) return res.status(500).json({ error: 'DB error', detail: err });
        res.json({ success: true });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', detail: err });
  }
});

// Check if recipe is saved
router.post('/check', async (req, res) => {
  const { email, recipe_id } = req.body;
  try {
    const user_id = await getUserId(email);
    if (!user_id) return res.status(404).json({ error: 'User not found' });

    db.query(
      'SELECT 1 FROM saved_recipes WHERE user_id = ? AND recipe_id = ?',
      [user_id, recipe_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'DB error', detail: err });
        res.json({ isSaved: results.length > 0 });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', detail: err });
  }
});

// List all saved recipes
router.get('/list', async (req, res) => {
  const email = req.session?.user?.email;
  if (!email) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const user_id = await getUserId(email);
    if (!user_id) return res.status(404).json({ error: 'User not found' });

    db.query(
      'SELECT recipe_id, recipe_title, image_url FROM saved_recipes WHERE user_id = ? ORDER BY saved_at DESC',
      [user_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'DB error', detail: err });
        res.json(results);
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', detail: err });
  }
});


module.exports = router;
