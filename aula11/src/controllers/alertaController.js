const Alerta = require('../models/Alerta');

const alertaController = {
  criar: async (req, res) => {
    try {
      const novoAlerta = await Alerta.create(req.body);
      res.status(201).json(novoAlerta);
    } catch (erro) {
      res.status(400).json({ erro: "Erro ao criar alerta.", detalhe: erro.message });
    }
  },

  buscarPorSeveridade: async (req, res) => {
    try {
      const { nivel } = req.params;

      const resultados = await Alerta.find({ 
        nivelSeveridade: nivel.toUpperCase() 
      }).sort({ createdAt: -1 });

      if (resultados.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum alerta encontrado para o nível de severidade informado." });
      }

      res.status(200).json(resultados);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao buscar alertas por severidade.", detalhe: erro.message });
    }
  }
};

module.exports = alertaController;
