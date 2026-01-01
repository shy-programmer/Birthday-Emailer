const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config();
const { join } = require('node:path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const birthdayRoute = require('./birthdayApi/birthday.route')
const {connect} = require('./utils/database');
connect();
require('./utils/BirthdayMailer')

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/v1/birthday', birthdayRoute);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, './views/birthday.index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});