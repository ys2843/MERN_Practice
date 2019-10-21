const express = require('express');
const app = new express();
const PORT = process.env.port || 5000;
const connectDB = require('./config/db');

connectDB();
app.get('/', (req, res) => { res.send(`Server running on port ${PORT}`) });
app.listen(PORT, () => { console.log(`Server listening to port ${PORT}`) });
