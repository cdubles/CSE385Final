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
        const [winCount] = await pool.query('SELECT COUNT(*) as winCount FROM results WHERE driverId = ? AND `position` = 1',[driverId]);
        if (results.length > 0) {
            const final = {
                driver: results,
                wins: winCount[0].winCount
            };
                res.json(final);
        } else {
            res.status(404).json({ error: 'Driver not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching driver data' });
    }
};

const getTeamById = async (req, res) => {
    console.log(req.params);
    try {
        const teamId = req.params.id;
        const [constructorDetails] = await pool.query(
            'SELECT * FROM constructors WHERE constructorId = ?',
            [teamId]
        );

        // Second query to count wins
        const [winCount] = await pool.query(
            'SELECT COUNT(*) as winCount FROM results WHERE constructorId = ? AND `position` = 1',
            [teamId]
        );
        if (constructorDetails.length > 0) {
             // Combine results
        const final = {
            constructor: constructorDetails,
            wins: winCount[0].winCount
        };
            res.json(final);

        } else {
            res.status(404).json({ error: 'Team not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching team data' });
    }
};
module.exports = { getDriverStats, getTeamStats, getDriverById, getTeamById };
