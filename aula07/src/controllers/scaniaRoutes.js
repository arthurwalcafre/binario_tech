const express = require('express');
const router = express.Router();
const scaniaController = 
require('../controllers/scaniaController');

router.get('/', scaniaController.listarTelemetria');
roster.post('/', scaniaController.registarTelemetria);

module.exports = router;
