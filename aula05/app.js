const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger.js');
const authMiddleware = require('./middlewares/auth');
const validaCnh = require('./middlewares/validaCnh'); // Importando a validação do Ex 05
const motoristasRouter = require('./routes/motoristas');
const manutencoesRouter = require('./routes/manutencoes');

const app = express();
const PORT = 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Rota Publica
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: "ONLINE", aplicacao: "Binario Tech API v2" });
});

// Rotas Protegidas por Autenticacao
// Nota: validaCnh intercepta requisições de motoristas (Exercício 05)
app.use('/api/v1/motoristas', authMiddleware, validaCnh, motoristasRouter);
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);

// Middleware Global de Tratamento de Erros 404 (Rota nao encontrada)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint nao encontrado no servidor Binario Tech." });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] Servidor de Middlewares ativo na porta ${PORT}`);
});
