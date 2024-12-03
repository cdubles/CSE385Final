const express = require('express');
const bodyParser = require('body-parser');
const { passport } = require('./controllers/authController');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("./public"));
app.use('/auth', authRoutes);
app.use('/api', dataRoutes);
// Routes
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/index.html");
    } else {
        res.redirect("/login.html");
    }
});
;

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});