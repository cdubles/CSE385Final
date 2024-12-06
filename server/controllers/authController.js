const bcrypt = require('bcryptjs');
const pool = require('../config/db.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log("login")
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length === 0) return done(null, false, { message: 'User not found' });

            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("Bad password")
                return done(null, false, { message: 'Invalid credentials' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.idusers);
});

passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE idusers = ?', [id]);
        if (rows.length === 0) return done(null, false);

        const user = rows[0];
        done(null, user);
    } catch (error) {
        done(error);
    }
});

const registerUser = async (req, res) => {
    console.log("register");
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send(info.message);

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                message: 'User logged in successfully',
            });
        });
    })(req, res, next);
};

module.exports = { registerUser, loginUser, passport, session };
