const express = require('express');
const mongoose = require('mongoose');
const alertaRoutes = require('./src/routes/alertaRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/binario_tech')
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/api/v1/alertas', alertaRoutes);

app.listen(3003, () => {
  console.log('Servidor rodando na porta 3000');
});

