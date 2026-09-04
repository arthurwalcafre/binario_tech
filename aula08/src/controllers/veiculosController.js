const db = require('../database/connections');

const veiculosController = {
  ListarTodos: async (req, res) => {
    try {
      const veiculos = await db('veiculos').select('*');
      res.status(200).json(veiculos);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao consultar banco de dados.", detalhe: erro.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const veiculo = await db('veiculos').where({ id }).first();

      if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao localizado." });
      }

      return res.status(200).json(veiculo);
    } catch (erro) {
      return res.status(500).json({ erro: "Erro ao buscar veiculo.", detalhe: erro.message });
    }
  },

  criar: async (req, res) => {
    try {
      const { placa, montadora, modelo } = req.body;
      if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Placa, montadora e modelo sao obrigatorios." });
      }

      const [id] = await db('veiculos').insert({ placa, montadora, modelo });
      return res.status(201).json({ id, placa, montadora, modelo });
    } catch (erro) {
      return res.status(500).json({ erro: "Erro ao criar veiculo.", detalhe: erro.message });
    }
  },

  // Método para o Exercício 2 
  atualizarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ erro: "O campo 'status' é obrigatório." });
      }

      const atualizado = await db('veiculos')
        .where({ id })
        .update({ status });

      if (!atualizado) {
        return res.status(404).json({ erro: "Veiculo nao localizado." });
      }

      return res.status(200).json({ mensagem: "Status atualizado com sucesso." });
    } catch (erro) {
      return res.status(500).json({ erro: "Erro ao atualizar status.", detalhe: erro.message });
    }
  }
};

module.exports = veiculosController;
