const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

router.post('/', alertaController.criar);
router.get('/severidade/:nivel', alertaController.buscarPorSeveridade);

module.exports = router;
