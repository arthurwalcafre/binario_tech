const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
  equipamento: {
    type: String,
    required: [true, 'O nome do equipamento é obrigatório.']
  },
  descricao: {
    type: String,
    required: true
  },
  nivelSeveridade: {
    type: String,
    required: [true, 'O nível de severidade é obrigatório.'],
    enum: {
      values: ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'],
      message: '{VALUE} não é um nível de severidade válido.'
    }
  },
  tags: [{
    type: String
  }],
  metadados: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alerta', alertaSchema);
