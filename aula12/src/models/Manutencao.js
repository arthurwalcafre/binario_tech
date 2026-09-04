const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  descricao: { 
    type: String, 
    required: [true, 'A descrição do item é obrigatória.'] 
  },
  preco: { 
    type: Number, 
    required: [true, 'O preço é obrigatório.'],
    min: [0, 'O preço não pode ser negativo.']
  }
});

const manutencaoSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: [true, 'A placa do veículo é obrigatória.']
  },
  descricao: {
    type: String,
    required: true
  },
  custoTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pendente', 'Em Andamento', 'Concluído'],
    default: 'Pendente'
  },
  itens: [itemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Manutencao', manutencaoSchema);
