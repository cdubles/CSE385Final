const express = require('express');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local', { session: true }), loginUser);

module.exports = router;
