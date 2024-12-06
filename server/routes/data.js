const express = require('express');
const {getFavoriteTeams, getFavoriteDrivers,getDriverById, getTeamById,getDriversForTeam, SearchDrivers,getTeamsForDriver,addFavoriteDriver,addFavoriteTeam } = require('../controllers/dataController');
const { ensureAuthenticated } = require('../controllers/authController');
const router = express.Router();

router.get('/driver/:id', ensureAuthenticated,getDriverById);
router.get('/team/:id', ensureAuthenticated,getTeamById);
router.get('/getDriversForTeam/:id',ensureAuthenticated,getDriversForTeam);
router.get('/SearchDrivers',ensureAuthenticated,SearchDrivers);
router.get('/getTeamsForDriver/:id',getTeamsForDriver);

router.post('/addFavoriteDriver/:id',ensureAuthenticated,addFavoriteDriver);
router.post('/addFavoriteTeam/:id',ensureAuthenticated,addFavoriteTeam);

router.get('/getFavoriteDrivers', ensureAuthenticated,getFavoriteDrivers);
router.get('/getFavoriteTeams', ensureAuthenticated,getFavoriteTeams);

router.get('/test', (req, res) => {
    console.log("Testing");
    res.send("Testing");
});

module.exports = router;
