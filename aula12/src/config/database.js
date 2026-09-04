const mongoose = require('mongoose');

const conectarBanco = async () => {
	  try {
		      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/binario_tech';
		      await mongoose.connect(mongoURI);
		      console.log('MongoDB conectado com sucesso!');
		    } catch (erro) {
			        console.error('Erro na conexão com o MongoDB:', erro.message);
			        process.exit(1);
			      }
};

module.exports = conectarBanco;
