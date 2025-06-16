const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check session
function checkAuth(req, res, next) {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  next();
}

// Add or update a single ingredient
router.post('/add', checkAuth, (req, res) => {
  const { name, quantity, unit } = req.body;
  const email = req.session.user.email;

  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(500).send('User not found');
    const userId = users[0].user_id;

    db.query('SELECT * FROM fridge_ingredients WHERE user_id = ? AND name = ?', [userId, name], (err, existing) => {
      if (err) return res.status(500).send('Error checking fridge');

      if (existing.length > 0) {
        const newQty = parseFloat(existing[0].quantity || 0) + parseFloat(quantity);
        db.query('UPDATE fridge_ingredients SET quantity = ? WHERE ingredient_id = ?', [newQty, existing[0].ingredient_id], err =>
          err ? res.status(500).send('Update error') : res.sendStatus(200)
        );
      } else {
        db.query('INSERT INTO fridge_ingredients (user_id, name, quantity, unit) VALUES (?, ?, ?, ?)', [userId, name, quantity, unit], err =>
          err ? res.status(500).send('Insert error') : res.sendStatus(200)
        );
      }
    });
  });
});

// Add multiple ingredients (used in restock)
router.post('/add-multiple', checkAuth, (req, res) => {
  const { email, ingredients } = req.body;

  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(500).send('User not found');
    const userId = users[0].user_id;

    const ops = ingredients.map(name => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM fridge_ingredients WHERE user_id = ? AND name = ?', [userId, name], (err, existing) => {
          if (err) return reject(err);

          if (existing.length > 0) {
            db.query('UPDATE fridge_ingredients SET quantity = quantity + 1 WHERE ingredient_id = ?', [existing[0].ingredient_id], err =>
              err ? reject(err) : resolve()
            );
          } else {
            db.query('INSERT INTO fridge_ingredients (user_id, name, quantity) VALUES (?, ?, 1)', [userId, name], err =>
              err ? reject(err) : resolve()
            );
          }
        });
      });
    });

    Promise.allSettled(ops)
      .then(() => res.sendStatus(200))
      .catch(() => res.status(500).send("Batch insert error"));
  });
});

// List ingredients
router.get('/list', checkAuth, (req, res) => {
  const email = req.session.user.email;

  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(500).send('User not found');
    const userId = users[0].user_id;

    db.query('SELECT * FROM fridge_ingredients WHERE user_id = ?', [userId], (err, rows) => {
      if (err) return res.status(500).send('List error');
      res.json(rows);
    });
  });
});

// Reduce quantity or delete ingredient
router.post('/delete', checkAuth, (req, res) => {
  const { ingredient_id } = req.body;

  // Get current quantity
  db.query('SELECT quantity FROM fridge_ingredients WHERE ingredient_id = ?', [ingredient_id], (err, results) => {
    if (err || results.length === 0) return res.status(500).send('Ingredient not found');

    const currentQty = parseFloat(results[0].quantity || 0);
    if (currentQty > 1) {
      db.query('UPDATE fridge_ingredients SET quantity = ? WHERE ingredient_id = ?', [currentQty - 1, ingredient_id], (err) => {
        if (err) return res.status(500).send('Failed to decrement');
        res.sendStatus(200);
      });
    } else {
      db.query('DELETE FROM fridge_ingredients WHERE ingredient_id = ?', [ingredient_id], (err) => {
        if (err) return res.status(500).send('Failed to delete');
        res.sendStatus(200);
      });
    }
  });
});


// Delete all ingredients
router.post('/delete-all', checkAuth, (req, res) => {
  const email = req.body.email;
  if (!email) return res.status(400).send('Email required');

  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(500).send('User not found');
    const userId = users[0].user_id;

    db.query('DELETE FROM fridge_ingredients WHERE user_id = ?', [userId], (err) => {
      if (err) return res.status(500).send('Error deleting ingredients');
      res.sendStatus(200);
    });
  });
});


// Check if recipe can be made
router.post('/check', checkAuth, (req, res) => {
  const { email, ingredients } = req.body;
  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(500).send('User not found');
    const userId = users[0].user_id;

    db.query('SELECT name FROM fridge_ingredients WHERE user_id = ?', [userId], (err, rows) => {
      if (err) return res.status(500).send('Query error');
      const fridgeItems = rows.map(row => row.name.toLowerCase());
      const missing = ingredients.filter(name => !fridgeItems.includes(name.toLowerCase()));

      res.json({
        canCook: missing.length === 0,
        missing,
        ingredients
      });
    });
  });
});

// Use ingredients (decrease quantity or remove)
router.post('/use', checkAuth, (req, res) => {
  const { email, ingredients } = req.body;
  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(500).send('User not found');
    const userId = users[0].user_id;

    const ops = ingredients.map(name => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM fridge_ingredients WHERE user_id = ? AND LOWER(name) = LOWER(?) LIMIT 1', [userId, name], (err, rows) => {
          if (err || rows.length === 0) return resolve(); // skip if not found

          if (rows[0].quantity > 1) {
            db.query('UPDATE fridge_ingredients SET quantity = quantity - 1 WHERE ingredient_id = ?', [rows[0].ingredient_id], err =>
              err ? reject(err) : resolve()
            );
          } else {
            db.query('DELETE FROM fridge_ingredients WHERE ingredient_id = ?', [rows[0].ingredient_id], err =>
              err ? reject(err) : resolve()
            );
          }
        });
      });
    });

    Promise.allSettled(ops)
      .then(() => res.sendStatus(200))
      .catch(() => res.status(500).send('Use error'));
  });
});

// Restock ingredients (used in recipe page)
router.post('/restock', checkAuth, (req, res) => {
  const { email, ingredients } = req.body;

  if (!email || !Array.isArray(ingredients)) {
    return res.status(400).send("Invalid input");
  }

  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(500).send('User not found');
    const userId = results[0].user_id;

    const insertPromises = ingredients.map(name => {
      return new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM fridge_ingredients WHERE user_id = ? AND name = ?',
          [userId, name],
          (err, existing) => {
            if (err) return reject(err);

            if (existing.length > 0) {
              const newQty = parseFloat(existing[0].quantity || 0) + 1;
              db.query(
                'UPDATE fridge_ingredients SET quantity = ? WHERE ingredient_id = ?',
                [newQty, existing[0].ingredient_id],
                err => err ? reject(err) : resolve()
              );
            } else {
              db.query(
                'INSERT INTO fridge_ingredients (user_id, name, quantity) VALUES (?, ?, ?)',
                [userId, name, 1],
                err => err ? reject(err) : resolve()
              );
            }
          }
        );
      });
    });

    Promise.allSettled(insertPromises)
      .then(() => res.sendStatus(200))
      .catch(() => res.status(500).send("Restock failed for some items"));
  });
});


module.exports = router;
