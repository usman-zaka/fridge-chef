const express = require('express');
const argon2 = require('argon2'); //to hash the updated password
const db = require('../db');
const router = express.Router();

// route to delete a user
router.delete('/delete-user/:email', (req, res) => {
    const email = req.params.email;
    const query = 'DELETE FROM users WHERE email = ?';

    db.query(query, [email], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('server error');
        } else {
            res.send('User successfully deleted!');
        }
    });
});

// change password
router.post('/change-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    try {
        const hashedPassword = await argon2.hash(newPassword);

        db.query(query, [hashedPassword, email], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Server error');
            } else {
                res.send('Password updated successfully!');
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error hashing password');
    }

});

// to send back session info
router.get('/session-info', (req, res) => {
    // if no user logs in
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    // send back session info
    res.json({
        username: req.session.user.username,
        email: req.session.user.email,
        is_admin: req.session.user.is_admin === true
    });
});

module.exports = router;
