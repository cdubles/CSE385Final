const pool = require('../config/db.js');

const getDriverById = async (req, res) => {
    try {
        const driverId = req.params.id;
        const [results] = await pool.query('SELECT * FROM drivers WHERE driverId = ?', [driverId]);
        const [winCount] = await pool.query('SELECT COUNT(*) as winCount FROM results WHERE driverId = ? AND `position` = 1',[driverId]);
        const [winsData] = await pool.query('SELECT results.driverId, races.name,races.date FROM results LEFT JOIN races ON results.raceId = races.raceId WHERE results.driverId = ? AND results.`position` = 1;',[driverId]);
        if (results.length > 0) {
            const final = {
                driver: results,
                wins: winCount[0].winCount,
                winsData: winsData
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
        const [winsData] = await pool.query('SELECT results.driverId, races.name,races.date FROM results LEFT JOIN races ON results.raceId = races.raceId WHERE results.constructorId = ? AND results.`position` = 1;',[teamId]);

        if (constructorDetails.length > 0) {
             // Combine results
        const final = {
            constructor: constructorDetails,
            wins: winCount[0].winCount,
            winsData: winsData
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
    `SELECT * FROM (SELECT 'Driver' AS type, forename, surname, NULL AS team_name, driverId as id FROM drivers WHERE forename LIKE ? OR surname LIKE ? OR CONCAT(forename, ' ', surname) LIKE ? LIMIT 5) AS driver_results UNION SELECT * FROM (SELECT 'Team' AS type, NULL AS forename, NULL AS surname, name AS team_name, constructorId as id FROM constructors WHERE name LIKE ? LIMIT 5) AS team_results;
`,[`%${query}%`, `%${query}%`, `%${query}%`,`%${query}%`]
  );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
}

const addFavoriteDriver = async (req, res) => {
    const userId = req.user.idusers;
    const driverId = req.params.id;
    
    // Check if the combination already exists
    const checkQuery = 'SELECT * FROM favoriteDrivers WHERE userId = ? AND driverId = ?';
    try {
        const [existing] = await pool.query(checkQuery, [userId, driverId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'This driver is already in your favorites' });
        }

        // If not, add the favorite driver
        const query = 'INSERT INTO favoriteDrivers (userId, driverId) VALUES (?, ?)';
        const [results] = await pool.query(query, [userId, driverId]);
        console.log(results);

        res.status(201).json({message: 'Favorite added successfully',});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database query failed' });
    }
};


const addFavoriteTeam = async (req, res) => {
    const userId = req.user.idusers;
    const teamId = req.params.id;

    // Check if the combination already exists
    const checkQuery = 'SELECT * FROM favoriteTeams WHERE userId = ? AND teamId = ?';
    try {
        const [existing] = await pool.query(checkQuery, [userId, teamId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'This team is already in your favorites' });
        }

        // If not, add the favorite team
        const query = 'INSERT INTO favoriteTeams (userId, teamId) VALUES (?, ?)';
        const [results] = await pool.query(query, [userId, teamId]);

        res.status(201).json({message: 'Favorite added successfully',});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database query failed' });
    }
};


const getFavoriteDrivers = async (req, res) => {
    const userId = req.user.idusers;
    const query = `
        SELECT d.* 
        FROM favoritedrivers fd
        JOIN drivers d ON fd.driverId = d.driverId
        WHERE fd.userId = ?;
    `;
    try {
        const [results] = await pool.query(query, [userId]);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: 'No favorite drivers found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database query failed' });
    }
};

const getFavoriteTeams = async (req, res) => {
    const userId = req.user.idusers;
    const query = `
        SELECT t.* 
        FROM favoriteteams ft
        JOIN constructors t ON ft.teamId = t.constructorId
        WHERE ft.userId = ?;
    `;
    try {
        const [results] = await pool.query(query, [userId]);
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: 'No favorite teams found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database query failed' });
    }
};




module.exports = { getFavoriteTeams, getFavoriteDrivers, getDriverById, getTeamById,getDriversForTeam, SearchDrivers,getTeamsForDriver, addFavoriteDriver, addFavoriteTeam };
