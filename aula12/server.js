const express = require('express');
const cors = require('cors');
const conectarBanco = require('./src/config/database');
const manutencaoRoutes = require('./src/routes/manutencaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(manutencaoRoutes);

const PORT = process.env.PORT || 3000;

conectarBanco()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((erro) => {
    console.error('Erro ao conectar ao banco de dados:', erro);
  });
