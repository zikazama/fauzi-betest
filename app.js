require('dotenv').config();
require('./config/db');
const express = require('express');
const bodyParser = require('body-parser');
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/accounts', accountRoutes);
app.use('/api/users', userRoutes);
app.use('/', (req, res) => {
    res.send('Hello World, this is be test!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
