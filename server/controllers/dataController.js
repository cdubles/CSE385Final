const pool = require('../config/db.js');

const getDriverStats = async (req, res) => {
    console.log("getting driver stats");
};

const getTeamStats = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM teams');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching team stats' });
    }
};

const getDriverById = async (req, res) => {
    console.log(req.params);
    try {
        const driverId = req.params.id;
        const [results] = await pool.query('SELECT * FROM drivers WHERE driverId = ?', [driverId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Driver not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching driver data' });
    }
};

module.exports = { getDriverStats, getTeamStats, getDriverById };
