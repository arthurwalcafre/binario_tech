# binario_tech — Guia de terminal para prova

**Escopo:** aulas 04 em diante. As aulas 01, 02 e 03 foram removidas. O guia prioriza comandos, códigos e resultados esperados.

# Aula 04 — API RESTful de Frota de Veículos (Versão Prova)

## Informações importantes

- Porta padrão: `3003`.
- Pasta do projeto: `prova_aula04`.
- Os dados ficam na memória; ao reiniciar o servidor, voltam os veículos ID 1 e ID 2.
- Faça os exercícios 1 a 6 na ordem, sem reiniciar o servidor.
- O Exercício 5 depende do veículo ID 3, cadastrado no Exercício 2.
- Não delete veículos antes do Exercício 5.
- URLs com `?` devem ficar entre aspas.
- Use `curl -i` para conferir o status HTTP.

## Passo 0 — Definir a porta

```bash
export PORTA=3003
```

## Passo 1 — Criar a pasta e instalar o Express

```bash
cd ~/binario_tech
git pull origin main
mkdir -p prova_aula04
cd prova_aula04
npm init -y
npm install express
```

Se o caminho acima não existir no Cloud Shell:

```bash
cd ~/curso-pbe1/binario_tech
mkdir -p prova_aula04
cd prova_aula04
npm init -y
npm install express
```

## Passo 2 — Criar `frota_api.js`

```bash
cat > frota_api.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;
app.use(express.json());

let veiculos = [
  { id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
  { id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

app.get('/api/v1/veiculos', (req, res) => {
  const { status } = req.query;
  if (status) {
    const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
    return res.status(200).json(filtrados);
  }
  res.status(200).json(veiculos);
});

app.get('/api/v1/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const veiculo = veiculos.find(v => v.id === id);
  if (!veiculo) return res.status(404).json({ erro: "Veiculo nao encontrado na base de dados." });
  res.status(200).json(veiculo);
});

app.post('/api/v1/veiculos', (req, res) => {
  const { placa, montadora, modelo } = req.body;
  if (!placa || !montadora || !modelo) {
    return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
  }
  const novoVeiculo = { id: veiculos.length + 1, placa, montadora, modelo, status: "DISPONIVEL" };
  veiculos.push(novoVeiculo);
  res.status(201).json(novoVeiculo);
});

app.patch('/api/v1/veiculos/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const veiculo = veiculos.find(v => v.id === id);
  if (!veiculo) return res.status(404).json({ erro: "Veiculo nao encontrado." });
  if (!status) return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
  veiculo.status = status.toUpperCase();
  res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

app.delete('/api/v1/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = veiculos.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ erro: "Veiculo nao encontrado." });
  veiculos.splice(index, 1);
  res.status(200).json({ mensagem: `Veiculo ID ${id} removido com sucesso.` });
});

app.listen(PORT, () => console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`));
EOF
```

## Passo 3 — Iniciar o servidor e testar

```bash
PORT=$PORTA node frota_api.js &
curl -s http://localhost:$PORTA/api/v1/veiculos | jq .
```

**Resultado esperado:** JSON com os veículos de IDs `1` e `2`.

## Exercício 1 — Buscar veículo por ID

```bash
curl -s http://localhost:$PORTA/api/v1/veiculos/1 | jq .
```

**Resultado esperado:** veículo ID `1`, Scania R450, placa `ABC-1234`, status `DISPONIVEL`.

## Exercício 2 — Cadastrar veículo com POST

```bash
curl -s -i -X POST http://localhost:$PORTA/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540"}'
```

**Resultado esperado:** `201 Created` e veículo ID `3`, placa `KLL-9090`, montadora `Volvo`, modelo `FH 540`, status `DISPONIVEL`.

## Exercício 3 — Testar erro 400

```bash
curl -s -i -X POST http://localhost:$PORTA/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540"}'
```

**Resultado esperado:** `400 Bad Request` e mensagem indicando que `placa`, `montadora` e `modelo` são obrigatórios.

## Exercício 4 — Filtrar por status

```bash
curl -s "http://localhost:$PORTA/api/v1/veiculos?status=DISPONIVEL" | jq .
```

**Resultado esperado:** array contendo somente veículos com status `DISPONIVEL`; na sequência original, IDs `1` e `3`.

## Exercício 5 — Atualizar status com PATCH

```bash
curl -s -X PATCH http://localhost:$PORTA/api/v1/veiculos/3/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}' | jq .
curl -s http://localhost:$PORTA/api/v1/veiculos/3 | jq .
```

**Resultado esperado:** mensagem `Status atualizado com sucesso!`; o veículo ID `3` aparece com status `EM_ROTA`.

## Exercício 6 — Testar erro 404

```bash
curl -s -i -X DELETE http://localhost:$PORTA/api/v1/veiculos/99
curl -s -i -X PATCH http://localhost:$PORTA/api/v1/veiculos/99/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}'
```

**Resultado esperado:** ambos retornam `404 Not Found` e a mensagem `Veiculo nao encontrado.`.

## Exercício 7 — Adicionar a rota PUT

Pare o servidor e abra o arquivo:

```bash
pkill -f frota_api.js
nano frota_api.js
```

Adicione antes de `app.listen(...)`:

```javascript
app.put('/api/v1/veiculos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { placa, montadora, modelo, status } = req.body;
  const index = veiculos.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ erro: "Veiculo nao encontrado." });
  if (!placa || !montadora || !modelo) {
    return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
  }
  veiculos[index] = { id, placa, montadora, modelo, status: status ? status.toUpperCase() : "DISPONIVEL" };
  res.status(200).json(veiculos[index]);
});
```

Salve com `Ctrl+O`, `Enter`; saia com `Ctrl+X`. Reinicie:

```bash
PORT=$PORTA node frota_api.js &
```

Teste PUT:

```bash
curl -s -i -X PUT http://localhost:$PORTA/api/v1/veiculos/1 \
  -H "Content-Type: application/json" \
  -d '{"placa":"NEW-0001","montadora":"Scania","modelo":"R540","status":"DISPONIVEL"}'
curl -s http://localhost:$PORTA/api/v1/veiculos/1 | jq .
```

**Resultado esperado:** `200 OK`; o GET mostra placa `NEW-0001` e modelo `R540`.

Teste ID inexistente:

```bash
curl -s -i -X PUT http://localhost:$PORTA/api/v1/veiculos/99 \
  -H "Content-Type: application/json" \
  -d '{"placa":"NEW-0099","montadora":"Scania","modelo":"R540"}'
```

**Resultado esperado:** `404 Not Found`.

Teste sem placa:

```bash
curl -s -i -X PUT http://localhost:$PORTA/api/v1/veiculos/1 \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Scania","modelo":"R540"}'
```

**Resultado esperado:** `400 Bad Request`.

## Exercício 8 — Script Bash de CRUD

```bash
cat > teste_crud.sh << 'EOF'
#!/bin/bash
PORTA=${PORTA:-3003}
BASE="http://localhost:$PORTA/api/v1/veiculos"
LOG="crud_result.log"
echo "=== TESTE CRUD - $(date) ===" > "$LOG"
echo "--- 1. Cadastrando veiculo 1 ---" >> "$LOG"
R1=$(curl -s -X POST "$BASE" -H "Content-Type: application/json" -d '{"placa":"AAA-1111","montadora":"Scania","modelo":"R450"}')
echo "$R1" >> "$LOG"
ID1=$(echo "$R1" | jq -r .id)
echo "--- 2. Cadastrando veiculo 2 ---" >> "$LOG"
R2=$(curl -s -X POST "$BASE" -H "Content-Type: application/json" -d '{"placa":"BBB-2222","montadora":"Mercedes-Benz","modelo":"Actros"}')
echo "$R2" >> "$LOG"
ID2=$(echo "$R2" | jq -r .id)
echo "--- 3. Atualizando status do veiculo $ID1 ---" >> "$LOG"
curl -s -X PATCH "$BASE/$ID1/status" -H "Content-Type: application/json" -d '{"status":"EM_ROTA"}' >> "$LOG"
echo "" >> "$LOG"
echo "--- 4. Deletando veiculo $ID2 ---" >> "$LOG"
curl -s -X DELETE "$BASE/$ID2" >> "$LOG"
echo "" >> "$LOG"
echo "=== FIM DO TESTE ===" >> "$LOG"
EOF
chmod +x teste_crud.sh
./teste_crud.sh
cat crud_result.log
```

**Resultado esperado:** `crud_result.log` contém os dois cadastros, a atualização do primeiro para `EM_ROTA`, a exclusão do segundo e `=== FIM DO TESTE ===` no final.

## Extra — `npm start`

```bash
npm pkg set scripts.start="node frota_api.js"
cat package.json
npm start
```

**Resultado esperado:** o `package.json` mostra o script `start` e `npm start` inicia a API.

## Entrega — GitHub

```bash
cd ~/binario_tech
git status
git add prova_aula04
git commit -m "prova: aula04 - API RESTful de frota de veiculos"
git push origin main
```

**Resultado esperado:** commit criado e `git push` concluído sem erro. Arquivos para entregar: `frota_api.js`, `teste_crud.sh` e `crud_result.log`.

## Erros comuns

| Erro | Correção |
|---|---|
| `EADDRINUSE` | `pkill -f frota_api.js` e iniciar o servidor novamente. |
| `curl: (7) Failed to connect` | `PORT=$PORTA node frota_api.js &` |
| `Cannot PATCH /api/v1/veiculos/3` | Conferir se a URL termina em `/status`. |
| `jq: parse error` | Conferir servidor, URL e resposta. |
| `Cannot find module 'express'` | Rodar `npm install express` na pasta do projeto. |
| Exercício 5 retorna 404 | Refazer o cadastro do Exercício 2 sem reiniciar o servidor. |
| `git push` rejeitado | `git pull origin main` e tentar novamente. |
| `Please tell me who you are` | Configurar `git config --global user.name "Seu Nome"` e `git config --global user.email "seu@email.com"`. |

## Códigos HTTP

| Código | Resultado |
|---|---|
| `200 OK` | Operação concluída. |
| `201 Created` | Recurso criado. |
| `400 Bad Request` | Dados obrigatórios ausentes ou inválidos. |
| `404 Not Found` | Recurso não encontrado. |


## Aula 05 - Middlewares, Validação e Segurança

### Exercício 1
O que fazer: Fazer uma requisição GET na rota de health e conferir a mensagem do `loggerMiddleware` no terminal.

Comando:
curl -s http://localhost:3003/api/v1/health


---

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Exercício 2
O que fazer: Criar o arquivo `routes/manutencoes.js` com rotas pra listar e cadastrar manutenções.

Conteúdo do arquivo:
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ mensagem: "Lista de manutenções" });
});

router.post('/', (req, res) => {
  res.status(201).json({ mensagem: "Manutenção cadastrada", dados: req.body });
});

module.exports = router;


---

**Resultado esperado:** A operação deve concluir sem erro; quando houver criação de recurso, a resposta esperada é `201 Created` e um JSON com os dados criados.

### Exercício 3
O que fazer: Registrar o roteador de manutenções no `app.js`, no caminho `/api/v1/manutencoes`, usando o `authMiddleware`.

No `app.js`, adicionar:
const manutencoesRouter = require('./routes/manutencoes');
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);


---

**Resultado esperado:** A operação deve concluir sem erro; quando houver criação de recurso, a resposta esperada é `201 Created` e um JSON com os dados criados.

### Exercício 4
O que fazer: Criar o middleware `middlewares/validaCnh.js`, que garante que a CNH tenha exatamente 11 dígitos numéricos.

Conteúdo do arquivo:
module.exports = (req, res, next) => {
  const { cnh } = req.body;

  if (!cnh || !/^\d{11}$/.test(cnh)) {
    return res.status(400).json({ erro: "CNH inválida. Deve conter exatamente 11 dígitos numéricos." });
  }

  next();
};


---

**Resultado esperado:** O comando deve finalizar sem erro; `git status`/`git push` deve confirmar o estado do repositório.

### Exercício 5
O que fazer: Aplicar o `validaCnh` só na rota POST de motoristas, e testar com uma CNH inválida.

No arquivo de rotas de motoristas:
const validaCnh = require('../middlewares/validaCnh');
router.post('/', validaCnh, (req, res) => {
  res.status(201).json({ mensagem: "Motorista cadastrado" });
});

Comando pra testar:
curl -s -i -X POST http://localhost:3003/api/v1/motoristas \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste", "cnh": "123"}'


---

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Exercício 6
O que fazer: Acessar uma rota que não existe (`/api/v1/clientes`) e confirmar que o middleware global de 404 responde em JSON.

Comando:
curl -s -i http://localhost:3003/api/v1/clientes


---

**Resultado esperado:** A requisição deve retornar `404 Not Found` e uma mensagem de recurso não encontrado.

### Exercício 7
O que fazer: Script Bash que simula 3 tentativas sem chave de API e 1 com chave válida, logando tudo em `audit_seguranca.log`.

Comando pra criar:
cat > teste_seguranca.sh << 'EOF'
#!/bin/bash
echo "=== Tentativa 1 - sem chave ===" >> audit_seguranca.log
curl -s -i http://localhost:3003/api/v1/manutencoes >> audit_seguranca.log

echo "=== Tentativa 2 - sem chave ===" >> audit_seguranca.log
curl -s -i http://localhost:3003/api/v1/manutencoes >> audit_seguranca.log

echo "=== Tentativa 3 - sem chave ===" >> audit_seguranca.log
curl -s -i http://localhost:3003/api/v1/manutencoes >> audit_seguranca.log

echo "=== Tentativa 4 - com chave valida ===" >> audit_seguranca.log
curl -s -i http://localhost:3003/api/v1/manutencoes \
  -H "x-api-key: SUA_CHAVE_AQUI" >> audit_seguranca.log

echo "=== Fim do teste de seguranca ===" >> audit_seguranca.log
EOF
chmod +x teste_seguranca.sh
./teste_seguranca.sh


---

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Exercício 8
O que fazer: Achar o PID do processo da API e encerrar.

Comando:
ps aux | grep node
kill -9 <PID>

**Resultado esperado:** o processo Node indicado pelo PID é encerrado. Confira com `ps aux | grep node`; cuidado para não matar um processo que não seja o servidor da aula.

## Aula 06 - Persistência em Arquivo JSON (Ocorrências)

### Exercício 1
O que fazer: Fazer uma requisição GET na rota `/api/v1/ocorrencias` via httpie e confirmar que a resposta é um array com os dados do `ocorrencias.json`.

Comando:
http GET http://localhost:3003/api/v1/ocorrencias


---

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Exercício 2
O que fazer: Usar o `jq` pra filtrar, dentro do `ocorrencias.json`, só os registros da montadora "Scania".

Comando:
cat ocorrencias.json | jq '.[] | select(.montadora == "Scania")'


---

**Resultado esperado:** A operação deve concluir sem erro; quando houver criação de recurso, a resposta esperada é `201 Created` e um JSON com os dados criados.

### Exercício 3
O que fazer: Criar a rota GET `/api/v1/ocorrencias/montadora/:nome`, que filtra as ocorrências pela montadora passada na URL.

No arquivo de rotas:
const fs = require('fs');

router.get('/montadora/:nome', (req, res) => {
  const dados = JSON.parse(fs.readFileSync('ocorrencias.json', 'utf-8'));
  const filtradas = dados.filter(
    (item) => item.montadora.toLowerCase() === req.params.nome.toLowerCase()
  );
  res.json(filtradas);
});

Comando pra testar:
curl -s http://localhost:3003/api/v1/ocorrencias/montadora/Scania | jq .


---

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Exercício 4
O que fazer: Criar a rota DELETE `/api/v1/ocorrencias/:id`, que remove a ocorrência correspondente do arquivo.

No arquivo de rotas:
router.delete('/:id', (req, res) => {
  let dados = JSON.parse(fs.readFileSync('ocorrencias.json', 'utf-8'));
  const idProcurado = parseInt(req.params.id);
  const existeAntes = dados.some((item) => item.id === idProcurado);

  dados = dados.filter((item) => item.id !== idProcurado);
  fs.writeFileSync('ocorrencias.json', JSON.stringify(dados, null, 2));

  if (!existeAntes) {
    return res.status(404).json({ erro: "Ocorrência não encontrada" });
  }
  res.json({ mensagem: `Ocorrência ${idProcurado} removida com sucesso` });
});

Comando pra testar:
curl -s -i -X DELETE http://localhost:3003/api/v1/ocorrencias/1


---

**Resultado esperado:** A resposta deve confirmar a exclusão/remoção; confira o status HTTP e a mensagem JSON retornada.

### Exercício 5
O que fazer: Script Bash que encerra o processo Node e apaga o `ocorrencias.json`, resetando o ambiente.

Comando pra criar:
cat > limpar_dados.sh << 'EOF'
#!/bin/bash
echo "Encerrando processo Node..."
pkill -f "node"

echo "Removendo ocorrencias.json..."
rm -f ocorrencias.json

echo "Ambiente resetado com sucesso!"
EOF
chmod +x limpar_dados.sh
./limpar_dados.sh

**Resultado esperado:** A resposta deve confirmar a exclusão/remoção; confira o status HTTP e a mensagem JSON retornada.

## Aula 07 - Controllers, Rotas Modulares e Validação de VIN

### Exercício 1
O que fazer: Criar o controller `src/controllers/mercedesController.js` e a rota `src/routes/mercedesRoutes.js` pra gerenciar a frota Actros e Atego da Mercedes-Benz.

Conteúdo de `src/controllers/mercedesController.js`:
const listarCaminhoes = (req, res) => {
  res.json([
    { modelo: "Actros", status: "ativo" },
    { modelo: "Atego", status: "ativo" }
  ]);
};

const cadastrarCaminhao = (req, res) => {
  res.status(201).json({ mensagem: "Caminhão Mercedes cadastrado", dados: req.body });
};

module.exports = { listarCaminhoes, cadastrarCaminhao };

Conteúdo de `src/routes/mercedesRoutes.js`:
const express = require('express');
const router = express.Router();
const mercedesController = require('../controllers/mercedesController');

router.get('/', mercedesController.listarCaminhoes);
router.post('/', mercedesController.cadastrarCaminhao);

module.exports = router;


---

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Exercício 2
O que fazer: Conectar o roteador da Mercedes no `server.js`, no caminho `/api/v1/telemetria/mercedes`.

No `server.js`:
const mercedesRoutes = require('./src/routes/mercedesRoutes');
app.use('/api/v1/telemetria/mercedes', mercedesRoutes);

Comando pra testar:
curl -s http://localhost:3003/api/v1/telemetria/mercedes | jq .


---

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 3
O que fazer: Criar o middleware `src/middlewares/validaVin.js`, garantindo que o VIN tenha exatamente 12 caracteres.

Conteúdo do arquivo:
module.exports = (req, res, next) => {
  const { vin } = req.body;

  if (!vin || vin.length !== 12) {
    return res.status(400).json({ erro: "VIN inválido. Deve conter exatamente 12 caracteres." });
  }

  next();
};


---

**Resultado esperado:** A requisição válida deve seguir para a rota; a inválida deve retornar o status de erro previsto no exercício.

### Exercício 4
O que fazer: Aplicar o `validaVin` na rota POST de telemetria da Scania, e testar com um VIN inválido.

No arquivo de rotas da Scania:
const validaVin = require('../middlewares/validaVin');
router.post('/', validaVin, (req, res) => {
  res.status(201).json({ mensagem: "Telemetria Scania registrada" });
});

Comando pra testar:
curl -s -i -X POST http://localhost:3003/api/v1/telemetria/scania \
  -H "Content-Type: application/json" \
  -d '{"vin": "123", "modelo": "R450"}'


---

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Exercício 5
O que fazer: Script Bash que testa todas as rotas ativas do servidor em sequência, logando tudo em `auditoria.log`.

Comando pra criar:
cat > auditoria_completa.sh << 'EOF'
#!/bin/bash
echo "=== AUDITORIA COMPLETA - $(date) ===" >> auditoria.log

echo "--- /api/v1/telemetria/scania ---" >> auditoria.log
curl -s http://localhost:3003/api/v1/telemetria/scania >> auditoria.log
echo "" >> auditoria.log

echo "--- /api/v1/telemetria/mercedes ---" >> auditoria.log
curl -s http://localhost:3003/api/v1/telemetria/mercedes >> auditoria.log
echo "" >> auditoria.log

echo "--- /api/v1/telemetria/vw ---" >> auditoria.log
curl -s http://localhost:3003/api/v1/telemetria/vw >> auditoria.log
echo "" >> auditoria.log

echo "=== FIM DA AUDITORIA ===" >> auditoria.log
EOF
chmod +x auditoria_completa.sh
./auditoria_completa.sh

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

## Aula 08 - Persistência com Knex e SQLite

### Exercício 1
O que fazer: Adicionar o método `buscarPorId` no `veiculosController.js`, consultando a tabela `veiculos` pelo `id` via Knex, retornando 404 se não achar.

No `veiculosController.js`:
const buscarPorId = async (req, res) => {
  const { id } = req.params;
  const veiculo = await db('veiculos').where({ id }).first();

  if (!veiculo) {
    return res.status(404).json({ erro: "Veículo não encontrado" });
  }

  res.json(veiculo);
};

module.exports = { ...outrosMetodos, buscarPorId };

Comando pra testar:
curl -s http://localhost:3003/api/v1/veiculos/1 | jq .


---

**Resultado esperado:** para um ID existente (ex.: `1`), retorna o JSON do veículo; para um ID inexistente, retorna `404 Not Found`.

### Exercício 2
O que fazer: Criar a rota PATCH `/:id/status` em `src/routes/veiculosRoutes.js`, atualizando o status direto na tabela SQLite via Knex.

No `veiculosRoutes.js`:
router.patch('/:id/status', veiculosController.atualizarStatus);

No `veiculosController.js`:
const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const atualizados = await db('veiculos').where({ id }).update({ status });

  if (atualizados === 0) {
    return res.status(404).json({ erro: "Veículo não encontrado" });
  }

  res.json({ mensagem: `Status do veículo ${id} atualizado para ${status}` });
};

Comando pra testar:
curl -s -i -X PATCH http://localhost:3003/api/v1/veiculos/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "EM_ROTA"}'


---

**Resultado esperado:** A resposta deve refletir a alteração solicitada; faça um GET ou leia o arquivo/log para confirmar o novo valor.

### Exercício 3
O que fazer: Criar uma migration pra tabela `motoristas` (id, nome, cnh única, categoria) e rodar via CLI.

Comando pra criar o arquivo da migration:
npx knex migrate:make criar_tabela_motoristas

Conteúdo do arquivo gerado (em `migrations/..._criar_tabela_motoristas.js`):
exports.up = function (knex) {
  return knex.schema.createTable('motoristas', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('cnh').notNullable().unique();
    table.string('categoria').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('motoristas');
};

Comando pra executar:
npx knex migrate:latest


---

**Resultado esperado:** O comando deve terminar sem erro; confira a saída do Knex e a existência da tabela/migration.

### Exercício 4
O que fazer: Reverter a última migration (`rollback`) e reaplicar em seguida (`migrate:latest`).

Comando:
npx knex migrate:rollback
npx knex migrate:latest

**Resultado esperado:** O comando deve terminar sem erro; confira a saída do Knex e a existência da tabela/migration.

## Aula 09 - Telemetria Relacionada a Veículos (Foreign Key)

### Exercício 1
O que fazer: Criar o método `buscarPorVeiculo` no `telemetriaController.js`, na rota `/api/v1/telemetria/veiculo/:id`, retornando só as leituras daquele veículo.

No `telemetriaController.js`:
const buscarPorVeiculo = async (req, res) => {
  const { id } = req.params;
  const leituras = await db('telemetria').where({ veiculo_id: id });

  res.json(leituras);
};

Na rota:
router.get('/veiculo/:id', telemetriaController.buscarPorVeiculo);

Comando pra testar:
curl -s http://localhost:3003/api/v1/telemetria/veiculo/1 | jq .


---

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Exercício 2
O que fazer: Tentar cadastrar telemetria com um `veiculo_id` inexistente (999) e confirmar que retorna 404.

No `telemetriaController.js`, no método de cadastro:
const cadastrar = async (req, res) => {
  const { veiculo_id } = req.body;

  const veiculoExiste = await db('veiculos').where({ id: veiculo_id }).first();
  if (!veiculoExiste) {
    return res.status(404).json({ erro: "Veículo não encontrado para associar a telemetria" });
  }

  const [id] = await db('telemetria').insert(req.body);
  res.status(201).json({ mensagem: "Telemetria cadastrada", id });
};

Comando pra testar:
curl -s -i -X POST http://localhost:3003/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d '{"veiculo_id": 999, "temperatura_motor": 90}'


---

**Resultado esperado:** A requisição deve retornar `404 Not Found` e uma mensagem de recurso não encontrado.

### Exercício 3
O que fazer: Adicionar um filtro por query param no `listarRelatorioCompleto`, pra mostrar só leituras com `temperatura_motor` acima de 95 quando `?alerta=true`.

No `telemetriaController.js`:
const listarRelatorioCompleto = async (req, res) => {
  const { alerta } = req.query;

  let query = db('telemetria');

  if (alerta === 'true') {
    query = query.where('temperatura_motor', '>', 95);
  }

  const leituras = await query;
  res.json(leituras);
};

Comando pra testar:
curl -s "http://localhost:3003/api/v1/telemetria/relatorio?alerta=true" | jq .


---

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 4
O que fazer: Inserir um veículo Volkswagen modelo Delivery, e depois duas leituras de telemetria pra esse veículo.

Comando pra cadastrar o veículo:
curl -s -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Volkswagen", "modelo": "Delivery", "placa": "VWD-0001"}'

(Anota o `id` que a resposta retornar — vamos chamar de `<ID_DO_VEICULO>` abaixo.)

Comando pra inserir as duas leituras (substitua `ID_DO_VEICULO` pelo ID numérico retornado no cadastro):

```bash
curl -s -i -X POST http://localhost:3003/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d '{"veiculo_id": ID_DO_VEICULO, "temperatura_motor": 88, "velocidade": 70}'

curl -s -i -X POST http://localhost:3003/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d '{"veiculo_id": ID_DO_VEICULO, "temperatura_motor": 92, "velocidade": 60}'
```

**Resultado esperado:** o cadastro do veículo e as duas leituras devem responder com `201 Created`. Cada resposta deve trazer os dados criados ou o ID gerado.

## Aula 10 - Seeds, Tratamento de Erros e Scripts de Manutenção

### Exercício 1
O que fazer: Criar o seed `src/database/seeds/02_povoar_mais_veiculos.js`, adicionando 2 veículos (Mercedes-Benz e DAF) sem apagar os já existentes.

Conteúdo do arquivo:
exports.seed = async function (knex) {
  await knex('veiculos').insert([
    { montadora: "Mercedes-Benz", modelo: "Actros", placa: "MBZ-1001" },
    { montadora: "DAF", modelo: "XF", placa: "DAF-2002" }
  ]);
};

Comando pra executar:
npx knex seed:run --specific=02_povoar_mais_veiculos.js

**Resultado esperado:** A operação deve concluir sem erro; quando houver criação de recurso, a resposta esperada é `201 Created` e um JSON com os dados criados.

### Exercício 2
O que fazer: No `tratarErros.js`, adicionar verificação pra erro de sintaxe no JSON do corpo da requisição, retornando 400.

No `tratarErros.js`:
module.exports = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }
  res.status(500).json({ erro: "Erro interno no servidor" });
};

Comando pra testar:
curl -s -i -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Scania", "modelo": "R450"'

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Exercício 3
O que fazer: Criar o script `"db:reset"` no `package.json`, rodando rollback, migrate e seed em sequência.

No `package.json`, dentro de `"scripts"`:
"db:reset": "knex migrate:rollback --all && knex migrate:latest && knex seed:run"

Comando pra testar:
npm run db:reset

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Exercício 4
O que fazer: Tentar inserir um veículo sem o campo `placa` e confirmar que o validador retorna 400.

Comando:
curl -s -i -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Scania", "modelo": "R450"}'

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

## Aula 11 - Mongoose, Alertas e Validação por Enum

### Exercício 1
O que fazer: Criar o método `buscarPorSeveridade` no `alertaController.js`, filtrando pela rota `/api/v1/alertas/severidade/:nivel`.

No `alertaController.js`:
const buscarPorSeveridade = async (req, res) => {
  const { nivel } = req.params;
  const alertas = await Alerta.find({ nivelSeveridade: nivel });
  res.json(alertas);
};

Comando pra testar:
curl -s http://localhost:3003/api/v1/alertas/severidade/ALTO | jq .

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Exercício 2
O que fazer: Adicionar ao `alertaSchema` um campo `tags`, do tipo Array de Strings.

No Schema:
const alertaSchema = new mongoose.Schema({
  // ... campos já existentes
  tags: {
    type: [String],
    default: []
  }
});

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 3
O que fazer: Tentar inserir um alerta com `nivelSeveridade: 'INVALIDO'` e observar o erro de validação do Enum.

Comando:
curl -s -i -X POST http://localhost:3003/api/v1/alertas \
  -H "Content-Type: application/json" \
  -d '{"nivelSeveridade": "INVALIDO", "descricao": "teste"}'

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Exercício 4
O que fazer: Inserir um alerta com severidade `'BAIXO'` e metadados customizados (tipo de carga, velocidade).

Comando:
curl -s -X POST http://localhost:3003/api/v1/alertas \
  -H "Content-Type: application/json" \
  -d '{"nivelSeveridade": "BAIXO", "descricao": "Alerta de rotina", "metadados": {"tipoCarga": "Granel", "velocidade": 80}}'

**Resultado esperado:** A operação deve concluir sem erro; quando houver criação de recurso, a resposta esperada é `201 Created` e um JSON com os dados criados.

## Aula 12 - Subdocumentos, Regex e Validação de Custo

### Exercício 1
O que fazer: Criar um método no controller pra buscar manutenções pela placa, com busca parcial case-insensitive usando `$regex`.

No controller:
const buscarPorPlaca = async (req, res) => {
  const { placa } = req.query;
  const manutencoes = await Manutencao.find({
    placa: { $regex: placa, $options: 'i' }
  });
  res.json(manutencoes);
};

Comando pra testar:
curl -s "http://localhost:3003/api/v1/manutencoes/buscar?placa=abc" | jq .

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Exercício 2
O que fazer: Criar o POST `/api/v1/manutencoes/:id/pecas`, adicionando um subdocumento de peça ao array `pecasSubstituidas` usando `$push`.

No controller:
const adicionarPeca = async (req, res) => {
  const { id } = req.params;
  const manutencao = await Manutencao.findByIdAndUpdate(
    id,
    { $push: { pecasSubstituidas: req.body } },
    { new: true, runValidators: true }
  );

  if (!manutencao) {
    return res.status(404).json({ erro: "Manutenção não encontrada" });
  }

  res.json(manutencao);
};

Comando pra testar:
curl -s -X POST http://localhost:3003/api/v1/manutencoes/<ID>/pecas \
  -H "Content-Type: application/json" \
  -d '{"nome": "Filtro de óleo", "custoUnitario": 85.50}'

**Resultado esperado:** A resposta deve refletir a alteração solicitada; faça um GET ou leia o arquivo/log para confirmar o novo valor.

### Exercício 3
O que fazer: No `itemPecaSchema`, impedir que `custoUnitario` aceite valores negativos.

No Schema:
const itemPecaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  custoUnitario: {
    type: Number,
    required: true,
    min: [0, "O custo não pode ser negativo"]
  }
});

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 4
O que fazer: Deletar uma manutenção pelo `_id` e confirmar o 200 com mensagem de confirmação.

Comando:
curl -s -i -X DELETE http://localhost:3003/api/v1/manutencoes/<ID>

**Resultado esperado:** A resposta deve confirmar a exclusão/remoção; confira o status HTTP e a mensagem JSON retornada.

## Aula 13 - Validação Avançada e Sanitização

### Exercício 1
O que fazer: Na lista `regrasCadastroVeiculo`, fazer o campo `placa` ser convertido automaticamente pra maiúsculas.

Na lista de validação (express-validator):
const regrasCadastroVeiculo = [
  body('placa')
    .trim()
    .toUpperCase()
    .notEmpty().withMessage("Placa é obrigatória"),
  // ... outras regras
];

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 2
O que fazer: Adicionar o campo opcional `anoFabricacao`, validando que seja número inteiro entre 2000 e o ano atual (se for enviado).

Na lista de validação:
body('anoFabricacao')
  .optional()
  .isInt({ min: 2000, max: new Date().getFullYear() })
  .withMessage(`Ano deve estar entre 2000 e ${new Date().getFullYear()}`)

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 3
O que fazer: Criar um middleware que exige o header `Content-Type: application/json` em requisições POST, senão retorna 400.

Middleware customizado:
module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ erro: "Content-Type deve ser application/json" });
  }
  next();
};

Comando pra testar (sem o header certo):
curl -s -i -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: text/plain" \
  -d '{"montadora": "Scania"}'

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Exercício 4
O que fazer: Enviar um payload incorreto e usar `jq` pra filtrar só a lista de mensagens de erro.

Comando:
curl -s -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Scania"}' | jq '.erros[].msg'

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

## Aula 14 - Autenticação JWT, Perfis e Expiração de Token

### Exercício 1
O que fazer: Criar o middleware `autorizarPerfil(perfisPermitidos)`, liberando acesso só se o perfil do token JWT estiver na lista.

Middleware:
const autorizarPerfil = (perfisPermitidos) => {
  return (req, res, next) => {
    const { perfil } = req.usuario; // vindo do middleware de autenticação JWT

    if (!perfisPermitidos.includes(perfil)) {
      return res.status(403).json({ erro: "Acesso negado para este perfil" });
    }

    next();
  };
};

module.exports = autorizarPerfil;

Uso numa rota:
router.delete('/:id', autenticar, autorizarPerfil(['ADMIN']), veiculosController.deletar);

**Resultado esperado:** A requisição válida deve seguir para a rota; a inválida deve retornar o status de erro previsto no exercício.

### Exercício 2
O que fazer: Mudar a expiração do JWT pra 15 segundos, logar, esperar, e tentar acessar a rota protegida depois.

No `authController.js`:
const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, process.env.JWT_SECRET, {
  expiresIn: '15s'
});

Comando pra testar (login, espera, e tenta acessar):
TOKEN=$(curl -s -X POST http://localhost:3003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@teste.com", "senha": "123456"}' | jq -r .token)

sleep 16

curl -s -i http://localhost:3003/api/v1/veiculos \
  -H "Authorization: Bearer $TOKEN"

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Exercício 3
O que fazer: Enviar uma senha com menos de 6 caracteres no registro e confirmar que é rejeitada com 400.

Comando:
curl -s -i -X POST http://localhost:3003/api/v1/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@teste.com", "senha": "123"}'

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Exercício 4
O que fazer: Enviar um token JWT corrompido/alterado manualmente e confirmar que retorna 403 Forbidden.

Comando:
curl -s -i http://localhost:3003/api/v1/veiculos \
  -H "Authorization: Bearer token.invalido.corrompido"

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

## Aula 16 - Git Pull, .gitignore e Auditoria de Processos

### Exercício 1
O que fazer: Subir uma alteração simples no Cloud Shell, rodar `git pull origin main` no servidor da sala e confirmar que o arquivo atualizou.

Comando:
git pull origin main
cat <nome_do_arquivo_alterado>

**Resultado esperado:** A resposta deve refletir a alteração solicitada; faça um GET ou leia o arquivo/log para confirmar o novo valor.

### Exercício 2
O que fazer: Criar o `.gitignore` na raiz da pasta `binario_tech`, ignorando `node_modules` e `.env` de todas as aulas.

Comando:
cat > ~/curso-pbe1/binario_tech/.gitignore << 'EOF'
node_modules/
.env
EOF

**Resultado esperado:** O comando deve finalizar sem erro; `git status`/`git push` deve confirmar o estado do repositório.

### Exercício 3
O que fazer: Script Bash `auditoria_servidor.sh` que lista processos Node ativos e grava em `processos.log`.

Comando pra criar:
cat > auditoria_servidor.sh << 'EOF'
#!/bin/bash
echo "=== Auditoria de Processos Node - $(date) ===" > processos.log
ps aux | grep node >> processos.log
EOF
chmod +x auditoria_servidor.sh
./auditoria_servidor.sh

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Exercício 4
O que fazer: Commitar o `auditoria_servidor.sh`, dar push, e confirmar na interface do GitHub que a pasta `aula16` foi publicada.

Comando:
git add .
git commit -m "feat: aula16 - script de auditoria de processos"
git push origin main

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

## Aula 17 - Simulado Pré-Exame: Health Check, JWT e Git Status

### Exercício 1
O que fazer: Script `testar_simulado.sh` que faz GET em `/api/v1/health` e grava o status code em `health_check.log`.

Comando pra criar:
cat > testar_simulado.sh << 'EOF'
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/api/v1/health)
echo "Status Code: $STATUS" > health_check.log
EOF
chmod +x testar_simulado.sh
./testar_simulado.sh
cat health_check.log

**Resultado esperado:** A resposta deve refletir a alteração solicitada; faça um GET ou leia o arquivo/log para confirmar o novo valor.

### Exercício 2
O que fazer: Criar o endpoint POST `/api/v1/auth/token-teste`, gerando um JWT válido por 5 minutos.

No servidor:
app.post('/api/v1/auth/token-teste', (req, res) => {
  const token = jwt.sign({ usuario: "teste" }, process.env.JWT_SECRET, { expiresIn: '5m' });
  res.json({ token });
});

Comando pra testar:
curl -s -X POST http://localhost:3003/api/v1/auth/token-teste | jq .

**Resultado esperado:** A operação deve concluir sem erro; quando houver criação de recurso, a resposta esperada é `201 Created` e um JSON com os dados criados.

### Exercício 3
O que fazer: Usar o token do Exercício 2 pra acessar `/api/v1/simulado/status` e extrair só o nome do usuário.

Comando:
TOKEN=$(curl -s -X POST http://localhost:3003/api/v1/auth/token-teste | jq -r .token)
curl -s http://localhost:3003/api/v1/simulado/status \
  -H "Authorization: Bearer $TOKEN" | jq -r .usuario

**Resultado esperado:** A resposta deve refletir a alteração solicitada; faça um GET ou leia o arquivo/log para confirmar o novo valor.

### Exercício 4
O que fazer: Rodar `git status` e garantir que a árvore de trabalho esteja limpa antes de encerrar.

Comando:
git status

**Resultado esperado:** A resposta deve confirmar a exclusão/remoção; confira o status HTTP e a mensagem JSON retornada.

## Aula 18 - Avaliação Prática: Registro, Login e JWT (4 questões, 2.5 cada)

### Questão 1
O que fazer: Endpoint POST `/api/v1/prova/register`, recebendo email e senha (mín. 6 caracteres), salvando a senha com hash via bcryptjs (salt 10).

No controller:
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { email, senha } = req.body;

  if (!senha || senha.length < 6) {
    return res.status(400).json({ erro: "Senha deve ter no mínimo 6 caracteres" });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  // salvar no banco: { email, senha: senhaHash }

  res.status(201).json({ mensagem: "Usuário registrado" });
};

Comando pra testar:
curl -s -X POST http://localhost:3003/api/v1/prova/register \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@teste.com", "senha": "123456"}'

**Resultado esperado:** A rota deve responder com JSON no formato solicitado; confira os campos e os valores retornados.

### Questão 2
O que fazer: Endpoint POST `/api/v1/prova/login`, validando credenciais e devolvendo JWT (id + email) com expiração de 30 minutos.

No controller:
const login = async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await buscarUsuarioPorEmail(email);

  const senhaValida = usuario && await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, {
    expiresIn: '30m'
  });

  res.json({ token });
};

Comando pra testar:
curl -s -X POST http://localhost:3003/api/v1/prova/login \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@teste.com", "senha": "123456"}'

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Questão 3
O que fazer: Middleware `validarJWT.js`, aplicado em GET `/api/v1/prova/relatorio` — 401 se faltar token, 403 se for inválido.

No `validarJWT.js`:
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não informado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido ou expirado" });
    }
    req.usuario = usuario;
    next();
  });
};

**Resultado esperado:** A validação deve rejeitar os dados; confira o status HTTP esperado (`400 Bad Request` quando indicado no enunciado) e a mensagem JSON de erro.

### Questão 4
O que fazer: Script `testar_prova.sh` que cadastra usuário, loga, guarda o token, e acessa a rota protegida com `jq`.

Comando pra criar:
cat > testar_prova.sh << 'EOF'
#!/bin/bash
curl -s -X POST http://localhost:3003/api/v1/prova/register \
  -H "Content-Type: application/json" \
  -d '{"email": "prova@teste.com", "senha": "123456"}'

TOKEN=$(curl -s -X POST http://localhost:3003/api/v1/prova/login \
  -H "Content-Type: application/json" \
  -d '{"email": "prova@teste.com", "senha": "123456"}' | jq -r .token)

curl -s http://localhost:3003/api/v1/prova/relatorio \
  -H "Authorization: Bearer $TOKEN" | jq .
EOF
chmod +x testar_prova.sh
./testar_prova.sh

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

## Aula 19 - PM2: Memória, Ecosystem e Persistência

### Exercício 1
O que fazer: Limitar o processo `api-telemetria` a 100MB de memória com `--max-memory-restart`.

Comando:
pm2 delete api-telemetria
pm2 start server.js --name "api-telemetria" --max-memory-restart 100M
pm2 describe api-telemetria

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 2
O que fazer: Criar o `ecosystem.config.js`, definindo variáveis de ambiente de Desenvolvimento e Produção.

Comando pra criar:
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "api-telemetria",
      script: "server.js",
      max_memory_restart: "100M",
      env: { NODE_ENV: "development", PORT: 3003 },
      env_production: { NODE_ENV: "production", PORT: 3003 }
    }
  ]
};
EOF
pm2 delete api-telemetria
pm2 start ecosystem.config.js --env production

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 3
O que fazer: Salvar a lista de processos do PM2 pra persistir após reinicialização do sistema.

Comando:
pm2 save

**Resultado esperado:** Confira se o comando terminou sem erro e se a saída corresponde ao resultado descrito no enunciado.

### Exercício 4
O que fazer: Commit e push das alterações da `aula19` pro GitHub.

Comando:
git add .
git commit -m "feat: aula19 - PM2, limite de memoria e ecosystem.config.js"
git push origin main

**Resultado esperado:** O comando deve finalizar sem erro; `git status`/`git push` deve confirmar o estado do repositório.

## Aula 20 - Proxy Reverso com Nginx

### Exercício 1
O que fazer: Criar o bloco `location /status-nginx` no Nginx, retornando um JSON fixo com status 200, sem passar pela aplicação Node.

No arquivo `/etc/nginx/sites-available/binario_aluno.conf`, dentro do bloco `server`:
location /status-nginx {
    default_type application/json;
    return 200 '{"status": "ativo", "servico": "Nginx Binario Tech"}';
}

Comando pra aplicar e testar:
sudo nginx -t
sudo service nginx reload
curl -s http://localhost:8080/status-nginx | jq .

**Resultado esperado:** `curl` retorna JSON com `status: "ativo"` e `servico: "Nginx Binario Tech"`. `sudo nginx -t` deve indicar que a sintaxe está correta.

### Exercício 2
O que fazer: Adicionar `client_max_body_size 2M;` no Nginx, pra barrar requisições com payload maior que 2MB.

No bloco `server` do `binario_aluno.conf`:
client_max_body_size 2M;

Comando pra testar (manda ~3MB de propósito):
curl -s -i -X POST http://localhost:8080/api/v1/proxy/ \
  -H "Content-Type: application/json" \
  -d "$(head -c 3000000 /dev/zero | tr '\0' 'a')"

**Resultado esperado:** a requisição maior que 2 MB retorna `413 Request Entity Too Large` (ou `413 Payload Too Large`, conforme a versão do Nginx).

### Exercício 3
O que fazer: Script `analisar_logs_nginx.sh` que lê as últimas 15 linhas do log de acesso e filtra só as com status 200.

Comando pra criar:

```bash
cat > analisar_logs_nginx.sh << 'EOF'
#!/bin/bash
echo "=== Últimas 15 linhas com status 200 OK ==="
sudo tail -n 15 /var/log/nginx/access.log | grep ' 200 '
EOF
chmod +x analisar_logs_nginx.sh
./analisar_logs_nginx.sh
```

**Resultado esperado:** aparecem no máximo 15 linhas recentes do log de acesso que contenham o status `200`. Se não houver requisições bem-sucedidas recentes, a saída pode ficar vazia.

## Aula 21 - CI/CD Local: Pipeline de Deploy, Logs e Git Hooks

### Exercício 1
O que fazer: Mudar a versão no `server.js` pra "1.0.1", commitar localmente e rodar o `./deploy.sh`, confirmando a mudança no endpoint.

Comando pra editar (atenção: a chave não tem aspas no JS, é `versao:`, não `"versao":`):
sed -i 's/versao: "1.0.0"/versao: "1.0.1"/' server.js

Comando pra commitar e rodar o deploy:
cd ~/curso-pbe1/binario_tech
git add aula21/server.js
git commit -m "fix: aula21 - versao 1.0.1"
cd aula21
./deploy.sh
curl -s http://localhost:3003/api/v1/versao | jq .

**Resultado esperado:** o endpoint `/api/v1/versao` retorna JSON com `"versao": "1.0.1"`.

### Exercício 2
O que fazer: Adicionar ao `deploy.sh` um passo que grava data/hora e hash do commit a cada deploy, em `deploy_history.log`.

Comando pra adicionar ao final do script:
cat >> deploy.sh << 'EOF'

echo "[LOG] Registrando deploy no historico..."
echo "$(date '+%Y-%m-%d %H:%M:%S') - Commit: $(git rev-parse --short HEAD)" >> deploy_history.log
EOF

Comando pra testar:
./deploy.sh
cat deploy_history.log

**Resultado esperado:** O script deve terminar sem erro e gerar/atualizar o arquivo de log indicado. Confira com `cat <arquivo_de_log>`.

### Exercício 3
O que fazer: Criar o Git Hook `post-commit`, que dispara o `deploy.sh` automaticamente sempre que um commit é feito.

Comando pra criar:
cat > ~/curso-pbe1/binario_tech/.git/hooks/post-commit << 'EOF'
#!/bin/bash
echo "[HOOK] Novo commit detectado na branch main. Disparando deploy..."
cd ~/curso-pbe1/binario_tech/aula21
./deploy.sh
EOF
chmod +x ~/curso-pbe1/binario_tech/.git/hooks/post-commit

Comando pra testar (commit vazio só pra disparar o hook):
git commit --allow-empty -m "teste: disparo do hook post-commit"

**Resultado esperado:** O comando deve finalizar sem erro; `git status`/`git push` deve confirmar o estado do repositório.

### Exercício 4
O que fazer: Commit e push dos arquivos da `aula21` (`server.js`, `deploy.sh`, `package.json`) pro GitHub.

Comando:
git add .
git commit -m "feat: aula21 - pipeline de deploy, log de historico e git hook post-commit"
git push origin main

**Resultado esperado:** O comando deve finalizar sem erro; `git status`/`git push` deve confirmar o estado do repositório.



---

## Observações sobre o material original

- A Aula 15 não aparece no README de origem; a numeração salta da Aula 14 para a Aula 16.
- Alguns trechos das aulas posteriores vieram incompletos no README original (por exemplo, o comando final de logs da Aula 20). Confira o enunciado da prova antes de copiar qualquer trecho que não tenha um comando completo e um resultado verificável.
