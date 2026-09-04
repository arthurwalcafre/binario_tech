const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');

router.post('/manutencoes', manutencaoController.criar);
router.get('/manutencoes', manutencaoController.listarComFiltros);
router.get('/manutencoes/placa/:placa', manutencaoController.buscarPorPlaca);
router.patch('/manutencoes/:id/status', manutencaoController.atualizarStatus);
router.delete('/manutencoes/:id', manutencaoController.excluir);
router.post('/manutencoes/:id/pecas', manutencaoController.adicionarPeca);

module.exports = router;
