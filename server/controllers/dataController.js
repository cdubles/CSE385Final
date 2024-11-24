const pool = require('./db.js');

const getDriverStats = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM drivers');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching driver stats' });
    }
};

const getTeamStats = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM teams');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching team stats' });
    }
};

module.exports = { getDriverStats, getTeamStats };
