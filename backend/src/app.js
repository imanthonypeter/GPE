const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
  res.send('GPE API is running');
});

const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT is missing in environment variables");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
