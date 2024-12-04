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
    try {
        const teamId = req.params.id;
        const [constructorDetails] = await pool.query('SELECT * FROM constructors WHERE constructorId = ?',[teamId]);
        const [winCount] = await pool.query('SELECT COUNT(*) as winCount FROM results WHERE constructorId = ? AND `position` = 1', [teamId]);
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

const getDriversForTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const [results] = await pool.query(
            'SELECT DISTINCT d.* FROM results r JOIN drivers d ON r.driverId = d.driverId WHERE r.constructorId = ?',
            [teamId]
        );
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'Drivers not found for team' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching team drivers' });
    }
};

const getTeamsForDriver = async (req, res) => {
    try {
        const teamId = req.params.id;
        const [results] = await pool.query(
            'SELECT DISTINCT c.* FROM results r JOIN constructors c ON r.constructorId = c.constructorId WHERE r.driverId = ?;',
            [teamId]
        );
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'Teams not found for driver' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching driver teams' });
    }
};

const SearchDrivers = async (req, res) => {
    const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  try {
    
const [results] = await pool.query(
    `SELECT * FROM drivers WHERE forename LIKE ? OR surname LIKE ? OR CONCAT(forename, ' ', surname) LIKE ? LIMIT 10;`,[`%${query}%`, `%${query}%`, `%${query}%`]
  );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
}
module.exports = { getDriverStats, getTeamStats, getDriverById, getTeamById,getDriversForTeam, SearchDrivers,getTeamsForDriver };
