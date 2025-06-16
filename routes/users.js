var express = require('express');
var router = express.Router();
var db = require('../db');
const argon2 = require('argon2'); // this is for hashing passwords

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST signup */
router.post('/signup', async function (req, res) {
  const { email, username, password } = req.body;

  // check if the email already exists (needs to be unque so that we can verify hashed passwords)
  db.query('SELECT * FROM users WHERE email = ?', [email], async function (insertErr, results) {
    if (insertErr) {
      console.error(insertErr);
      return res.send('Query failed');
    }

    if (results.length > 0) {
      return res.send('Email already exists');
    }

    try {
      const hashedPassword = await argon2.hash(password); //hashing password

      // insert user with the hashed password
      db.query(
        'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
        [email, username, hashedPassword],
        function (err) {
          if (err) {
            console.error(err);
            return res.send('Error creating account');
          }
          res.send('Account created successfully!');
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Error hashing password');
    }
  });
});

router.post('/signin', async function (req, res) {
  const { email, password } = req.body;

  // trimming inputs to match db
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  db.query('SELECT * FROM users WHERE email = ?', [trimmedEmail], async function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error with login');
    }

    if (results.length === 0) {
      return res.status(401).send('Wrong email or password');
    }

    const user = results[0];

    try {
      const valid = await argon2.verify(user.password, trimmedPassword);
      if (!valid) {
        return res.status(401).send('Wrong email or password');
      }

      req.session.user = {
        username: user.username,
        email: user.email,
        is_admin: user.is_admin === 1
      };

      res.json({
        message: "Sign in successful",
        username: user.username,
        email: user.email
      });

    } catch (verifyErr) {
      console.error(verifyErr);
      res.status(500).send('Password verification failed');
    }
  });
});

router.post('/update', function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) return res.send("Missing fields");

  // Check if user exists
  db.query('SELECT * FROM users WHERE email = ?', [email], function (err, results) {
    if (err) {
      console.error(err);
      return res.send("Error checking user");
    }

    if (results.length === 0) {
      return res.send("No user found with that email");
    }

    // hash password
    argon2.hash(password)
      .then(hashedPassword => {
        // Update password
        db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], function (updateErr, result) {
          if (updateErr) {
            console.error(updateErr);
            return res.send("Error updating password");
          }
          res.send("Password updated successfully");
        });
      })
      .catch(hashErr => {
        console.error(hashErr);
        res.status(500).send("Error hashing password");
      });
  });
});

router.post('/upload-pic', function(req,res){
  const email = req.query.email;

  // check if missing email
  if(!email){
    return res.status(400).send("Not logged into email");
  }

  // check if files are uploaded
  if(!req.files || !req.files.profile_pic){
    return res.status(400).send("No file uploaded");
  }

  const userPicture = req.files.profile_pic;
  //pfp go to images folder
  const uploadPath = __dirname + '/../public/images/' + userPicture.name;


// save uploaded file to server's file system
  userPicture.mv(uploadPath,function(err){
    if(err){
    console.error(err);
    return res.status(500).send("Error with saving the file");
    }

  const relativePath = 'images/' + userPicture.name;

  // Updating the database, image is assigned to an email
  db.query('UPDATE users SET profile_pic = ? WHERE email = ?',[relativePath,email], function(err){
      if (err) {
        console.error(err);
      return res.status(500).send("Error updating the database");
      }
      res.send("Profile picture successfully updated!");
    });
  });
});

// pfp image retrival
router.get('/get-pic', function(req,res){
  // check logged in
const email = req.query.email;
  if(!email){
    return res.status(400).send('Email is required');
  }

// get pfp from database
db.query('SELECT profile_pic FROM users WHERE email = ?',[email],function(err, results) {
    if (err || results.length === 0) {
      return res.status(500).send('No user found with email');
    }
    // return pfp or null
    res.json({ profile_pic: results[0].profile_pic || null });
  });
});


router.post('/delete', function (req, res) {
  const { email } = req.body;

  if (!email) return res.send("Missing email");

  db.query(
    'DELETE FROM users WHERE email = ?',
    [email],
    function (err, result) {
      if (err) {
        console.error(err);
        return res.send("Error deleting account");
      }

      if (result.affectedRows === 0) {
        return res.send("No user found");
      }

      res.send("Account deleted successfully");
    }
  );
});

// Route to check the session
router.get('/check-session', function (req, res) {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Route to log in
// Destroys the current session
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

