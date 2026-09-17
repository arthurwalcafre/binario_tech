const express = require('express');
const router = express.Router();
const validarJWT = require('../middlewares/validarJWT');

router.get('/relatorio', validarJWT, (req, res) => {
  res.json({ mensagem: 'Acesso liberado', usuario: req.usuario });
});

module.exports = router;
