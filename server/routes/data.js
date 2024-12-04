const express = require('express');
const { getDriverStats, getTeamStats, getDriverById, getTeamById,getDriversForTeam, SearchDrivers,getTeamsForDriver } = require('../controllers/dataController');
const router = express.Router();

router.get('/drivers', getDriverStats);
router.get('/teams', getTeamStats);
router.get('/driver/:id', getDriverById);
router.get('/team/:id', getTeamById);
router.get('/getDriversForTeam/:id',getDriversForTeam);
router.get('/SearchDrivers',SearchDrivers);
router.get('/getTeamsForDriver/:id',getTeamsForDriver);
router.get('/test', (req, res) => {
    console.log("Testing");
    res.send("Testing");
});

module.exports = router;
