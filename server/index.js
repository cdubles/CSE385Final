const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(bodyParser.json());

//ROUTES
//route for server frontend
app.use(express.static("../public"));

//routes for login and data
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

// START
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
