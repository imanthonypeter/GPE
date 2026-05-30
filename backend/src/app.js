const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const routes = require('./routes');

const app = express();

// Garante que a pasta de uploads existe
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadsDir));

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
