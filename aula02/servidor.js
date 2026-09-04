
nst express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/status', (req, res) => {
    res.json({
        servidor: "Binario Tech Core",
        status: "OPERACIONAL",
        montadoras_atendidas: ["Scania", "Mercedes", "VW"],
        uptime_segundos: process.uptime()
    });
});

app.get('/scania/info', (req, res) => {
    res.json({
        montadora: "Scania",
        foco: "Caminhoes Pesados e Onibus",
        sistema_telemetria: "Ativo",
        unidades_conectadas: 1420
    });
});

app.get('/vw/info', (req, res) => {
    res.json({
        montadora: "Volkswagen",
        foco: "Caminhões",
        sistema_telemetria: "RIO",
        unidades_conectadas: 1200
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
