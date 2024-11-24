const express = require('express');
const { getDriverStats, getTeamStats } = require('../controllers/dataController');
const router = express.Router();

router.get('/drivers', getDriverStats);
router.get('/teams', getTeamStats);

module.exports = router;
