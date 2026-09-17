const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.registrar = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!senha || senha.length < 6) {
      return res.status(400).json({ erro: 'Senha precisa ter no mínimo 6 caracteres' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ email, senha: senhaHash });

    res.status(201).json({ id: usuario._id, email: usuario.email });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
