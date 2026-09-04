const express = require('express');
const router = express.Router();

let manutencoes = [
    { id: 1, veiculoId: 1, descricao: "Troca de óleo", valor: 1500.00, status: "CONCLUIDO" }
];

// GET /api/v1/manutencoes
router.get('/', (req, res) => {
    res.status(200).json(manutencoes);
});

// POST /api/v1/manutencoes
router.post('/', (req, res) => {
    const { veiculoId, descricao, valor } = req.body;
    if (!veiculoId || !descricao || !valor) {
        return res.status(400).json({ erro: "Campos 'veiculoId', 'descricao' e 'valor' são obrigatórios." });
    }
    const novaManutencao = {
        id: manutencoes.length ? manutencoes[manutencoes.length - 1].id + 1 : 1,
        veiculoId,
        descricao,
        valor,
        status: "PENDENTE"
    };
    manutencoes.push(novaManutencao);
    res.status(201).json(novaManutencao);
});

module.exports = router;
