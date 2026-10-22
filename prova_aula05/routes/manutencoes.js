const express = require('express');
const router = express.Router();

let manutencoes = [
    { id: 1, caminhao: "Volvo FH 540", descricao: "Troca de oleo", valor: 850.00 }
];

// GET /api/v1/manutencoes
router.get('/', (req, res) => {
    res.status(200).json(manutencoes);
});

// POST /api/v1/manutencoes
router.post('/', (req, res) => {
    const { caminhao, descricao, valor } = req.body;

    if (!caminhao || !descricao || valor === undefined) {
        return res.status(400).json({ erro: "Campos 'caminhao', 'descricao' e 'valor' sao obrigatorios." });
    }

    const nova = { id: manutencoes.length + 1, caminhao, descricao, valor };
    manutencoes.push(nova);
    res.status(201).json(nova);
});

module.exports = router;
