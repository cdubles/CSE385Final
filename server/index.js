const express = require('express');
const bodyParser = require('body-parser');
const { passport } = require('./controllers/authController');
const session = require('express-session');
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
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