const express = require('express');
const cors = require('cors');
const veiculosRoutes = require('./src/routes/veiculosRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/vl/veiculos', veiculosRoutes);

app.use((req, res) => {
	res.status(404).json({ erro: "Rota nao encontrada no servidor Binario Tech"});
});

app.listen(PORT, () => {
  console.log(`[Binario Tech] Servidor com Banco SQLite ativo na porta ${PORT}`);
});

