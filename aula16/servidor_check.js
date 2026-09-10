const express = require('express');
const app = express();
const PORT = 3003;

// Comentando no arquivo servidor_check.js
app.use(express.json());

app.get('/api/v1/status-servidor', (req,res) => {
	res.json({
		status: "ONLINE",
		ambiente: "Servidor local de Prova - Binário Tech",
		usuario: process.env.USER || "aluno",
		dataCHeck: new Date()
	});
});

app.listen(PORT, () => {
	console.log(`[Binário Tech] Servidor de Validação da Aula 16 ativo na porta ${PORT}`);
});

