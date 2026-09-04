const express = require('express');
const router = express.Router();
const veiculosController = require('../controllers/veiculosController');

router.get('/', veiculosController.ListarTodos);
router.post('/', veiculosController.criar);
router.get('/:id', veiculosController.buscarPorId);

// EXERCÍCIO 2: Rota PATCH para atualizar o status do veículo
router.patch('/:id/status', veiculosController.atualizarStatus);

module.exports = router;
