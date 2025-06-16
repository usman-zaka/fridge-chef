require('dotenv').config();
var express = require('express');
const xss = require('xss-clean');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// const helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const fridgeRouter = require('./routes/fridge');
const savedRouter = require('./routes/saved');
const fileUpload = require('express-fileupload');
const adminRoutes = require('./routes/admin');
const protectHTMLfiles = require('./middleware/authMiddleware');



var app = express();


// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       "default-src": ["'self'"],
//       "script-src": [
//         "'self'",
//         "https://kit.fontawesome.com"
//       ],
//       "style-src": [
//         "'self'",
//         "'unsafe-inline'",
//         "https://fonts.googleapis.com",
//         "https://ka-f.fontawesome.com"
//       ],
//       "font-src": [
//         "'self'",
//         "https://fonts.gstatic.com",
//         "https://ka-f.fontawesome.com"
//       ],
//       "connect-src": [
//         "'self'",
//         "https://api.spoonacular.com",
//         "https://ka-f.fontawesome.com"
//       ],
//       "img-src": [
//         "'self'",
//         "data:",
//         "https://img.spoonacular.com"
//       ],
//       "object-src": ["'none'"]
//     }
//   })
// );


// Setting up the session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// to securely get the api key
app.get('/api/key', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

app.use(protectHTMLfiles);
app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(xss()); //santising after parsing
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fridge', fridgeRouter);
app.use('/saved', savedRouter);
app.use('/admin', adminRoutes);

module.exports = app;
