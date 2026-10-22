# AULA 05 - Middlewares, Router, CORS e 404 (Express)

> Projeto: `~/binario_tech/prova_aula05` | Porta: **3003** | Chave da API: `binario-tech-secret-2026`
> Os `cat > arquivo << 'EOF'` criam o arquivo e escrevem dentro de uma vez. Rodar sempre de dentro de `prova_aula05`.
> Se um arquivo parecer estranho, confira com `cat arquivo`.

## Conceitos rápidos
- **Middleware** = função `(req, res, next)` que roda antes da rota. `next()` passa pro próximo; `return res.status(...)` barra a requisição.
- **express.Router()** = divide as rotas em arquivos separados (`routes/`).
- **CORS** (`app.use(cors())`) = libera o navegador/front-end a chamar a API.
- **401** = sem autorização | **400** = dado inválido | **404** = rota não existe | **201** = criado.

## Passo 1 - Criar o projeto
```bash
cd ~/binario_tech
mkdir -p prova_aula05/routes prova_aula05/middlewares
cd prova_aula05
npm init -y
npm install express cors
```
Se o `cd ~/binario_tech` der "No such file or directory", ache o repo com:
```bash
cd "$(find ~ -maxdepth 3 -type d -name binario_tech | head -1)" && pwd
```
**Resultado esperado:** o `npm init -y` mostra o conteúdo do `package.json`, e o `npm install` termina com algo como `added 67 packages` e `found 0 vulnerabilities`. Com `ls` aparecem `middlewares`, `node_modules`, `routes`, `package.json` e `package-lock.json`.

## Passo 2 - `middlewares/logger.js` (registra método, rota, status e tempo)
```bash
cat > middlewares/logger.js << 'EOF'
function loggerMiddleware(req, res, next) {
    const inicio = Date.now();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const duracao = Date.now() - inicio;
        console.log(`[LOG ${timestamp}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duracao}ms)`);
    });

    next();
}

module.exports = loggerMiddleware;
EOF
```
**Resultado esperado:** nenhuma saída na tela. Conferir com `cat middlewares/logger.js`.

## Passo 3 - `middlewares/auth.js` (exige o header X-API-KEY)
```bash
cat > middlewares/auth.js << 'EOF'
function authMiddleware(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const CHAVE_VALIDA = "binario-tech-secret-2026";

    if (!apiKey || apiKey !== CHAVE_VALIDA) {
        return res.status(401).json({
            erro: "Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."
        });
    }

    next();
}

module.exports = authMiddleware;
EOF
```
**Resultado esperado:** nenhuma saída na tela. Conferir com `cat middlewares/auth.js`.

## Passo 4 - `routes/motoristas.js` (rotas modularizadas)
```bash
cat > routes/motoristas.js << 'EOF'
const express = require('express');
const router = express.Router();

let motoristas = [
    { id: 1, nome: "Carlos Silva", cnh: "12345678900", categoria: "E", ativo: true },
    { id: 2, nome: "Ana Pereira", cnh: "98765432100", categoria: "D", ativo: true }
];

// GET /api/v1/motoristas
router.get('/', (req, res) => {
    res.status(200).json(motoristas);
});

// POST /api/v1/motoristas
router.post('/', (req, res) => {
    const { nome, cnh, categoria } = req.body;

    if (!nome || !cnh || !categoria) {
        return res.status(400).json({ erro: "Campos 'nome', 'cnh' e 'categoria' sao obrigatorios." });
    }

    const novoMotorista = { id: motoristas.length + 1, nome, cnh, categoria, ativo: true };
    motoristas.push(novoMotorista);
    res.status(201).json(novoMotorista);
});

module.exports = router;
EOF
```
**Resultado esperado:** nenhuma saída na tela. Conferir com `cat routes/motoristas.js`.

## Passo 5 - `app.js` (servidor principal)
```bash
cat > app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');
const motoristasRouter = require('./routes/motoristas');

const app = express();
const PORT = 3003;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Rota publica
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: "ONLINE", aplicacao: "Binario Tech API v2" });
});

// Rotas protegidas
app.use('/api/v1/motoris
