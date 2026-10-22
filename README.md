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
app.use('/api/v1/motoristas', authMiddleware, motoristasRouter);

// 404 global (SEMPRE por ultimo)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint nao encontrado no servidor Binario Tech." });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] Servidor de Middlewares ativo na porta ${PORT}`);
});
EOF
```
**Resultado esperado:** nenhuma saída na tela. Conferir com `cat app.js`.

## Passo 6 - Rodar e testar
```bash
node app.js &
sleep 1
curl -s http://localhost:3003/api/v1/health | jq .
curl -s http://localhost:3003/api/v1/motoristas | jq .
curl -s -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3003/api/v1/motoristas | jq .
curl -s -X POST http://localhost:3003/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Roberto Souza","cnh":"55544433322","categoria":"E"}' | jq .
```
**Resultado esperado**, na ordem dos comandos:

`node app.js &` (sobe o servidor):
```text
[1] 2562
[Binario Tech] Servidor de Middlewares ativo na porta 3003
```
Health (200):
```text
{
  "status": "ONLINE",
  "aplicacao": "Binario Tech API v2"
}
```
Motoristas sem chave (401):
```text
{
  "erro": "Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."
}
```
Motoristas com chave (200): lista com Carlos Silva (id 1) e Ana Pereira (id 2).

POST (201):
```text
{
  "id": 3,
  "nome": "Roberto Souza",
  "cnh": "55544433322",
  "categoria": "E",
  "ativo": true
}
```
No terminal do servidor aparece um `[LOG ...]` por requisição, com os status 200, 401, 200 e 201.

---

## Exercício 01 - GET no health e ver o log
```bash
curl -s http://localhost:3003/api/v1/health | jq .
```
**Resultado esperado:** o JSON do health (`"status": "ONLINE"`) e, no terminal do servidor, uma linha de log:
```text
[LOG 2026-10-22T01:35:30.441Z] GET /api/v1/health - Status: 200 (7ms)
```
(a data e os ms mudam, o resto tem que bater)

## Exercício 02 - `routes/manutencoes.js` (listar e cadastrar)
```bash
cat > routes/manutencoes.js << 'EOF'
const express = require('express');
const router = express.Router();

let manutencoes = [
    { id: 1, caminhao: "Volvo FH 540", descricao: "Troca de oleo", valor: 850.00 }
];

// GET /api/v1/manutencoes
router.get('/', (req, res) => {
    res.status(200).json(manutencoes);
});

// POST /api/v1/manutencoes
router.post('/', (req, res) => {
    const { caminhao, descricao, valor } = req.body;

    if (!caminhao || !descricao || valor === undefined) {
        return res.status(400).json({ erro: "Campos 'caminhao', 'descricao' e 'valor' sao obrigatorios." });
    }

    const nova = { id: manutencoes.length + 1, caminhao, descricao, valor };
    manutencoes.push(nova);
    res.status(201).json(nova);
});

module.exports = router;
EOF
ls routes
```
**Resultado esperado:** nenhuma saída do `cat`, e o `ls routes` mostra:
```text
manutencoes.js  motoristas.js
```
(a rota ainda não funciona na API, só depois do Ex. 03)

## Exercício 03 - Registrar manutenções no `app.js` com auth
Reescreve o `app.js` já com a rota de manutenções, reinicia o servidor e testa:
```bash
cat > app.js << 'EOF'
const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');
const motoristasRouter = require('./routes/motoristas');
const manutencoesRouter = require('./routes/manutencoes');

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
app.use('/api/v1/motoristas', authMiddleware, motoristasRouter);
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);

// 404 global (SEMPRE por ultimo)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint nao encontrado no servidor Binario Tech." });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] Servidor de Middlewares ativo na porta ${PORT}`);
});
EOF

pkill -f "node app.js"
node app.js &
sleep 1
curl -s -H "X-API-KEY: binario-tech-secret-2026" http://localhost:3003/api/v1/manutencoes | jq .
```
**Resultado esperado** (200):
```text
[
  {
    "id": 1,
    "caminhao": "Volvo FH 540",
    "descricao": "Troca de oleo",
    "valor": 850
  }
]
```
O terminal pode avisar `Terminated node app.js` (é o servidor antigo morrendo, normal) e o servidor novo mostra `ativo na porta 3003`. Sem o header `X-API-KEY`, a mesma rota responde **401**.

## Exercício 04 - `middlewares/validaCnh.js` (CNH com 11 dígitos numéricos)
```bash
cat > middlewares/validaCnh.js << 'EOF'
function validaCnh(req, res, next) {
    const { cnh } = req.body;

    if (!/^\d{11}$/.test(String(cnh || ''))) {
        return res.status(400).json({ erro: "CNH invalida. Deve conter exatamente 11 digitos numericos." });
    }

    next();
}

module.exports = validaCnh;
EOF
ls middlewares
```
**Resultado esperado:** nenhuma saída do `cat`, e o `ls middlewares` mostra:
```text
auth.js  logger.js  validaCnh.js
```

## Exercício 05 - Aplicar `validaCnh` só no POST de motoristas
Reescreve o `routes/motoristas.js` com o middleware no POST (`router.post('/', validaCnh, ...)`), reinicia o servidor e testa com CNH inválida:
```bash
cat > routes/motoristas.js << 'EOF'
const express = require('express');
const router = express.Router();
const validaCnh = require('../middlewares/validaCnh');

let motoristas = [
    { id: 1, nome: "Carlos Silva", cnh: "12345678900", categoria: "E", ativo: true },
    { id: 2, nome: "Ana Pereira", cnh: "98765432100", categoria: "D", ativo: true }
];

// GET /api/v1/motoristas
router.get('/', (req, res) => {
    res.status(200).json(motoristas);
});

// POST /api/v1/motoristas (com validaCnh)
router.post('/', validaCnh, (req, res) => {
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

pkill -f "node app.js"
node app.js &
sleep 1
curl -s -X POST http://localhost:3003/api/v1/motoristas \
  -H "X-API-KEY: binario-tech-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","cnh":"123","categoria":"E"}' | jq .
```
**Resultado esperado** (400 Bad Request):
```text
{
  "erro": "CNH invalida. Deve conter exatamente 11 digitos numericos."
}
```
No terminal do servidor o log mostra `POST /api/v1/motoristas - Status: 400`. Com uma CNH de 11 números (ex: `"55544433322"`) volta o **201** normal. O GET continua funcionando, pois não passa pelo `validaCnh`.

## Exercício 06 - Rota inexistente (404 em JSON)
```bash
curl -s http://localhost:3003/api/v1/clientes | jq .
```
**Resultado esperado** (404, em JSON e não em HTML):
```text
{
  "erro": "Endpoint nao encontrado no servidor Binario Tech."
}
```
Log no terminal do servidor: `GET /api/v1/clientes - Status: 404`.

## Exercício 07 - Script `teste_seguranca.sh` (3 sem chave + 1 com chave)
O servidor precisa estar rodando.
```bash
cat > teste_seguranca.sh << 'EOF'
#!/bin/bash
URL="http://localhost:3003/api/v1/motoristas"
LOG="audit_seguranca.log"

> "$LOG"

for i in 1 2 3; do
    echo "Tentativa $i SEM chave:" >> "$LOG"
    curl -s -w "\nHTTP %{http_code}\n" "$URL" >> "$LOG"
done

echo "Tentativa COM chave valida:" >> "$LOG"
curl -s -w "\nHTTP %{http_code}\n" -H "X-API-KEY: binario-tech-secret-2026" "$URL" >> "$LOG"
EOF
chmod +x teste_seguranca.sh
./teste_seguranca.sh
cat audit_seguranca.log
```
**Resultado esperado:** o `./teste_seguranca.sh` não imprime nada no `cat` do script (tudo vai pro arquivo), mas o terminal do servidor mostra 3 logs de 401 e 1 de 200. O `cat audit_seguranca.log` mostra:
```text
Tentativa 1 SEM chave:
{"erro":"Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."}
HTTP 401
Tentativa 2 SEM chave:
{"erro":"Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."}
HTTP 401
Tentativa 3 SEM chave:
{"erro":"Acesso nao autorizado. Header 'X-API-KEY' invalido ou ausente."}
HTTP 401
Tentativa COM chave valida:
[{"id":1,"nome":"Carlos Silva","cnh":"12345678900","categoria":"E","ativo":true},{"id":2,"nome":"Ana Pereira","cnh":"98765432100","categoria":"D","ativo":true}]
HTTP 200
```
O que tem que bater: **três `HTTP 401` e um `HTTP 200`**.

## Exercício 08 - Encontrar e matar o processo da API
```bash
ps aux | grep "node app.js"
kill -9 2650
```
Troque o `2650` pelo número da **2ª coluna** da linha `node app.js` (sem `<` `>`). Ignore a linha do próprio `grep`.

**Resultado esperado:** o `ps` mostra a linha do servidor e a do grep:
```text
arthur   2650  0.7  0.8 ... node app.js
arthur   2695  0.0  0.0 ... grep --color=auto node app.js
```
O `kill -9` não imprime nada (o terminal pode avisar `[1]+ Killed node app.js`). Rodando o `ps` de novo, só sobra a linha do `grep`.

Atalho que não precisa do PID: `pkill -f "node app.js"`.
