const express = require('express');
const { getDriverStats, getTeamStats, getDriverById } = require('../controllers/dataController');
const router = express.Router();

router.get('/drivers', getDriverStats);
router.get('/teams', getTeamStats);
router.get('/driver/:id', getDriverById);
router.get('/test', (req, res) => {
    console.log("Testing");
    res.send("Testing");
});

module.exports = router;
