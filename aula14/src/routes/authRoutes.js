const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const autenticarToken = require('../middlewares/autenticarToken');
const autorizarPerfil = require('../middlewares/autorizarPerfil');

router.get('/perfil', autenticarToken, autorizarPerfil(['ADMIN']), authController.perfil);

// Rotas públicas
router.post('/register', authController.registrar);
router.post('/login', authController.login);

// Rota privada (exige Token JWT)
router.get('/perfil', autenticarToken, authController.perfil);

module.exports = router;

