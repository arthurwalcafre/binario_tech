require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./src/routes/authRoutes');
const relatorioRoutes = require('./src/routes/relatorioRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/prova', authRoutes);
app.use('/api/v1/prova', relatorioRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
