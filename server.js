const express = require('express');
const app = new express();
const PORT = process.env.port || 5000;
const connectDB = require('./config/db');

connectDB();
app.use(express.json({ extended: false }));
app.get('/', (req, res) => { res.send(`Server running on port ${PORT}`) });
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profiles'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => { console.log(`Server listening to port ${PORT}`) });
