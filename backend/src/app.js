const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Rota base
app.get('/', (req, res) => {
  res.send('GPE API está a rodar');
});

const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT está em falta nas variáveis de ambiente");

app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});

module.exports = app;
