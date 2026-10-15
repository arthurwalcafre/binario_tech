# binario_tech
## Aula 01 - Primeiro Contato com Cloud Shell

### Exercício 1
O que fazer: Criar o arquivo dev.json usando o editor nano, com a estrutura JSON básica dentro.

Comando:
nano dev.json

Conteúdo a colar dentro do arquivo:
{
  "nome": "Seu Nome Completo",
  "cargo": "Desenvolvedor Jr",
  "montadora_favorita": "Scania",
  "status": "Ativo"
}

Pra que serve: `nano` é o editor de texto do terminal — abre o arquivo (ou cria, se não existir) pra você digitar dentro dele. Salva com `Ctrl+O`, `Enter`, sai com `Ctrl+X`.


### Exercício 2
O que fazer: Ver o conteúdo do arquivo dev.json direto no terminal, sem abrir editor nenhum.

Comando:
cat dev.json

Pra que serve: `cat` imprime o conteúdo de um arquivo de texto na tela — útil pra conferir rápido o que tem dentro sem precisar abrir o nano.

### Exercício 3
O que fazer: Contar quantas linhas o arquivo dev.json tem.

Comando:
wc -l dev.json

Pra que serve: `wc` (word count) conta coisas num arquivo — a flag `-l` especifica que é pra contar **l**inhas. Como o JSON tem 6 linhas (abre chave, 4 campos, fecha chave), deve retornar `6 dev.json`.



## Aula 02 - Terminal Linux, NPM e Requisições

### Exercício 1
O que fazer: Ver o diretório atual e listar todos os arquivos, incluindo ocultos e com detalhes de permissão.

Comando:
pwd
ls -la

Pra que serve: `pwd` mostra em que pasta você está. `ls -la` lista os arquivos — o `-l` mostra detalhes (dono, permissões, tamanho) e o `-a` inclui arquivos ocultos (os que começam com ponto, tipo `.env`).

---

### Exercício 2
O que fazer: Mostrar as variáveis de ambiente do sistema, filtrando só as que têm "USER" ou "SHELL" no nome.

Comando:
env | grep -E "USER|SHELL"

Pra que serve: `env` lista todas as variáveis de ambiente (configurações do sistema). O `|` (pipe) manda essa lista pro `grep`, que filtra só as linhas que batem com o padrão — aqui, "USER" ou "SHELL".

---

### Exercício 3
O que fazer: Achar o PID (número do processo) do `node servidor.js` que está rodando.

Comando:
ps aux | grep node

Pra que serve: `ps aux` lista todos os processos rodando no sistema. O pipe manda isso pro `grep`, que filtra só as linhas que mencionam "node" — assim você acha o PID sem precisar procurar na lista inteira.

---

### Exercício 4
O que fazer: Verificar se a porta 3003 está aberta e escutando conexões.

Comando:
ss -tuln | grep 3003

Pra que serve: `ss -tuln` lista todas as portas de rede ativas no sistema (`-t` TCP, `-u` UDP, `-l` só as que estão escutando, `-n` mostra número em vez de nome). O `grep 3003` filtra só a sua porta.

---

### Exercício 5
O que fazer: Criar o arquivo `ambiente_info.txt` com data, nome da máquina e uso de memória.

Comando:
date > ambiente_info.txt
hostname >> ambiente_info.txt
free -h >> ambiente_info.txt

Pra que serve: `>` cria o arquivo (ou apaga e recria) com a saída do comando dentro. `>>` adiciona ao final sem apagar o que já tem — por isso o primeiro comando usa `>` e os outros dois usam `>>`, pra não sobrescrever um o outro.

---

### Exercício 6
O que fazer: Ver o conteúdo do `package.json` e confirmar se o `express` está nas dependências.

Comando:
cat package.json

Pra que serve: `cat` mostra o conteúdo do arquivo na tela. É só olhar dentro de `"dependencies"` e confirmar se aparece `"express"`.

---

### Exercício 7
O que fazer: Instalar o `nodemon` como dependência de desenvolvimento e confirmar a mudança no `package.json`.

Comando:
npm install -D nodemon
cat package.json

Pra que serve: `-D` (ou `--save-dev`) instala o pacote só pra uso durante o desenvolvimento (não vai pra produção). Depois o `cat` confirma que ele apareceu em `"devDependencies"`.

---

### Exercício 8
O que fazer: Extrair só o campo `"dependencies"` do `package.json`.

Comando:
cat package.json | jq .dependencies

Pra que serve: o `jq` filtra e formata JSON. Aqui ele pega o conteúdo todo do `package.json` (vindo do `cat` pelo pipe) e mostra só a parte de dentro de `"dependencies"`.

---

### Exercício 9
O que fazer: Criar um script chamado `"check"` no `package.json` que roda `node -v`, e testar com `npm run`.

No `package.json`, dentro de `"scripts"`, adiciona:
"check": "node -v"

Comando pra testar:
npm run check

Pra que serve: a seção `"scripts"` do `package.json` permite criar atalhos de comando. Com isso configurado, `npm run check` executa `node -v` por trás dos panos — mostra a versão do Node instalada.

---

### Exercício 10
O que fazer: Instalar um pacote globalmente e descobrir onde o binário dele foi salvo.

Comando:
sudo apt-get install -y httpie
which http

Pra que serve: `which` mostra o caminho completo de onde um comando está instalado no sistema (tipo `/usr/bin/http`). Isso prova que o pacote instalou e tá acessível de qualquer pasta.

---

### Exercício 11
O que fazer: Fazer uma requisição GET pra rota `/scania/info` e salvar a resposta num arquivo.

Comando:
curl -s http://localhost:3003/scania/info > scania.json

Pra que serve: `curl -s` faz a requisição sem mostrar informações extras de progresso. O `>` redireciona a resposta (o JSON) direto pro arquivo `scania.json`, em vez de mostrar na tela.

---

### Exercício 12
O que fazer: Fazer a mesma requisição, só que com o `httpie` em vez do `curl`.

Comando:
http GET http://localhost:3003/scania/info

Pra que serve: `httpie` é uma alternativa ao `curl` feita pra ser mais fácil de ler — ele já formata e colore o JSON de resposta automaticamente, sem precisar de `jq` separado.

---

### Exercício 13
O que fazer: Ler o `scania.json` e extrair só o valor da chave `sistema_telemetria`.

Comando:
cat scania.json | jq .sistema_telemetria

Pra que serve: mesma lógica do Exercício 8 — o `jq` filtra o JSON e devolve só o valor daquele campo específico, sem o resto da estrutura.

---

### Exercício 14
O que fazer: Adicionar a rota `/vw/info` no `servidor.js`, reiniciar o processo e testar.

No `servidor.js`, adicionar algo como:
app.get('/vw/info', (req, res) => {
  res.json({ montadora: "Volkswagen", status: "ativo" });
});

Comando pra reiniciar e testar:
pm2 restart servidor
curl -s http://localhost:3003/vw/info

Pra que serve: depois de editar o código, o Node não recarrega sozinho — por isso precisa reiniciar o processo (aqui com `pm2 restart`, se estiver usando PM2) antes de testar a rota nova.

---

### Exercício 15
O que fazer: Criar um script Bash que testa as 3 rotas (`/status`, `/scania/info`, `/vw/info`) e mostra o horário de cada teste.

Comando pra criar:
cat > testar_servidor.sh << 'EOF'
#!/bin/bash
echo "Teste /status - $(date)"
curl -s http://localhost:3003/status
echo ""
echo "Teste /scania/info - $(date)"
curl -s http://localhost:3003/scania/info
echo ""
echo "Teste /vw/info - $(date)"
curl -s http://localhost:3003/vw/info
echo ""
EOF
chmod +x testar_servidor.sh
./testar_servidor.sh

Pra que serve: `$(date)` insere a data/hora atual dentro do texto do `echo`. O script automatiza o teste das 3 rotas de uma vez, sem precisar digitar cada `curl` na mão.



## Aula 03 - Requisições, JSON e Gerenciamento de Processos

### Exercício 1
O que fazer: Fazer uma requisição GET pra rota `/api/v1/scania` e usar o `jq` pra mostrar só a chave `modelo`.

Comando:
curl -s http://localhost:3003/api/v1/scania | jq .modelo

Pra que serve: o `curl -s` busca os dados da rota sem mostrar informação extra de progresso. O pipe manda a resposta direto pro `jq`, que filtra e devolve só o campo `modelo`, sem o resto do JSON.

---

### Exercício 2
O que fazer: Fazer uma requisição pra rota `/api/v1/mercedes` usando o `httpie` e salvar o resultado em `mercedes.json`.

Comando:
http GET http://localhost:3003/api/v1/mercedes > mercedes.json

Pra que serve: o `httpie` faz a requisição (igual o `curl`, só que com formatação mais amigável na tela). O `>` redireciona a resposta pra dentro do arquivo `mercedes.json` em vez de só mostrar na tela.

---

### Exercício 3
O que fazer: Ler o arquivo `mercedes.json` e filtrar só o campo `status`.

Comando:
cat mercedes.json | jq .status

Pra que serve: mesma lógica dos exercícios anteriores de `jq` — lê o conteúdo do arquivo e extrai só o valor daquele campo específico.

---

### Exercício 4
O que fazer: Editar o `telemetria.js`, adicionar a rota `/api/v1/volvo` retornando o modelo "FH 540", reiniciar e testar.

No `telemetria.js`, adicionar algo como:
app.get('/api/v1/volvo', (req, res) => {
  res.json({ montadora: "Volvo", modelo: "FH 540", status: "ativo" });
});

Comando pra reiniciar e testar:
pm2 restart telemetria
curl -s http://localhost:3003/api/v1/volvo | jq .

Pra que serve: depois de mudar o código, o Node precisa reiniciar pra carregar a rota nova — o `pm2 restart` faz isso. Daí o `curl` + `jq` testa e já mostra formatado.

---

### Exercício 5
O que fazer: Adicionar o script `"start"` no `package.json` apontando pro `telemetria.js`, e testar com `npm start`.

No `package.json`, dentro de `"scripts"`, adiciona:
"start": "node telemetria.js"

Comando pra testar:
npm start

Pra que serve: isso cria um atalho padrão — `npm start` é o comando mais usado no mercado pra subir uma aplicação Node, em vez de digitar `node telemetria.js` toda vez.

---

### Exercício 6
O que fazer: Redirecionar o resultado do script `testar_telemetria.sh` pra um arquivo de log chamado `relatorio.log`.

Comando:
./testar_telemetria.sh > relatorio.log

Pra que serve: o `>` captura tudo que o script imprimiria na tela e salva dentro do `relatorio.log` em vez de mostrar — útil pra guardar um histórico/comprovante da auditoria.

---

### Exercício 7
O que fazer: Filtrar a resposta da rota `/api/v1/vw` pra mostrar só os campos `montadora` e `status`, numa chamada só de `jq`.

Comando:
curl -s http://localhost:3003/api/v1/vw | jq '{montadora, status}'

Pra que serve: o `jq '{campo1, campo2}'` monta um novo objeto JSON só com os campos que você escolher — nesse caso, pega a resposta inteira e devolve só `montadora` e `status`, descartando o resto.

---

### Exercício 8
O que fazer: Achar o PID do processo Node rodando e encerrar ele.

Comando:
ps aux | grep node
kill -9 <PID>

Pra que serve: o primeiro comando lista os processos e filtra os que mencionam "node", mostrando o PID (número do processo) na segunda coluna. O `kill -9 <PID>` força o encerramento desse processo — troca `<PID>` pelo número que apareceu no comando anterior.



## Aula 04 - API RESTful de Frota de Veículos (versão prova)

### Antes de começar (leia primeiro)

- **Porta:** usei **3003**. Se o enunciado da prova pedir outra porta, troque só no Passo 0 (o resto do README usa a variável `$PORTA`).
- **Pasta:** usei `prova_aula04`. Se o enunciado pedir outro nome, troque no Passo 1.
- **Os dados ficam na MEMÓRIA.** Se você parar o servidor e subir de novo, tudo volta ao início (só 2 veículos: ID 1 e ID 2).
- **Ordem dos exercícios:** faça do 1 ao 6 **sem reiniciar** o servidor. O Exercício 5 usa o veículo de ID 3, que só existe porque o Exercício 2 cadastrou ele. O servidor só é reiniciado no Exercício 7.
- **Não apague veículos antes do Exercício 5.** O ID novo é calculado pelo tamanho da lista, e apagar no meio pode gerar ID repetido.
- **URL com `?` sempre entre aspas** (`"http://...?status=DISPONIVEL"`), senão o terminal se confunde.
- **Para ver o status HTTP** (201, 400, 404) use `curl -i`.

---

### Passo 0 - Definir a porta

Comando:
```
export PORTA=3003
```

Pra que serve: guarda a porta numa variável. Assim, se a prova pedir outra porta, você troca só aqui. A variável vale só pro terminal aberto: se reconectar o SSH ou abrir outro terminal, rode de novo.

---

### Passo 1 - Criar a pasta da prova e instalar o Express

Comando:
```
cd ~/binario_tech
git pull origin main
mkdir -p prova_aula04
cd prova_aula04
npm init -y
npm install express
```

Pra que serve:
- `cd ~/binario_tech` entra no repositório (no Cloud Shell o caminho é `~/curso-pbe1/binario_tech`).
- `git pull origin main` atualiza o repositório com o que já está no GitHub.
- `mkdir -p prova_aula04` cria a pasta da prova, e `cd prova_aula04` entra nela.
- `npm init -y` cria o `package.json`.
- `npm install express` instala o Express (cria a pasta `node_modules`).

---

### Passo 2 - Criar o arquivo frota_api.js

Comando:
```
cat > frota_api.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Banco de dados em memoria
let veiculos = [
    { id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
    { id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

// 1. GET /api/v1/veiculos - Listar todos os veiculos (Suporta filtro por status query param)
app.get('/api/v1/veiculos', (req, res) => {
    const { status } = req.query;
    if (status) {
        const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
        return res.status(200).json(filtrados);
    }
    res.status(200).json(veiculos);
});

// 2. GET /api/v1/veiculos/:id - Buscar veiculo por ID
app.get('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);
    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado na base de dados." });
    }
    res.status(200).json(veiculo);
});

// 3. POST /api/v1/veiculos - Cadastrar novo veiculo (Criacao)
app.post('/api/v1/veiculos', (req, res) => {
    const { placa, montadora, modelo } = req.body;
    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }
    const novoVeiculo = {
        id: veiculos.length + 1,
        placa,
        montadora,
        modelo,
        status: "DISPONIVEL"
    };
    veiculos.push(novoVeiculo);
    res.status(201).json(novoVeiculo);
});

// 4. PATCH /api/v1/veiculos/:id/status - Atualizar status do veiculo
app.patch('/api/v1/veiculos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
    }

    veiculo.status = status.toUpperCase();
    res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

// 5. DELETE /api/v1/veiculos/:id - Remover veiculo da frota
app.delete('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = veiculos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    veiculos.splice(index, 1);
    res.status(200).json({ mensagem: `Veiculo ID ${id} removido com sucesso.` });
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`);
});
EOF
```

Pra que serve: cria o arquivo `frota_api.js` já com o código dentro. As aspas em `'EOF'` são obrigatórias, senão o terminal estraga o `${PORT}` e as crases do código. Confira com `ls`: tem que aparecer `frota_api.js`.

Se a prova pedir o servidor **já com a rota PUT**, use direto o arquivo completo do Exercício 7 neste passo.

---

### Passo 3 - Subir o servidor e testar

Comando:
```
PORT=$PORTA node frota_api.js &
curl -s http://localhost:$PORTA/api/v1/veiculos | jq .
```

Pra que serve: o `&` roda o servidor em segundo plano, e o terminal fica livre pros testes. Aparece a mensagem `[Binario Tech] API de Frotas rodando em http://localhost:3003` (aperte Enter se o prompt não voltar). O `curl` deve listar os 2 veículos iniciais.

**Cuidado:** aqui rode só esse `GET`. Os testes de POST, PATCH e DELETE são os próprios exercícios, e fazer antes bagunça os IDs.

Para parar o servidor (qualquer um dos dois jeitos):
```
pkill -f frota_api.js
```
ou
```
ps aux | grep node
kill -9 <PID>
```
No segundo, troque `<PID>` pelo número da segunda coluna da linha do `node frota_api.js`.

---

### Exercício 1
O que fazer: Buscar apenas o veículo de ID 1 com GET e mostrar formatado com `jq`.

Comando:
```
curl -s http://localhost:$PORTA/api/v1/veiculos/1 | jq .
```

Pra que serve: o `/1` no final da URL é o ID. O `jq .` deixa o JSON bonito. Resultado esperado: o veículo Scania R450, placa ABC-1234.

---

### Exercício 2
O que fazer: Cadastrar um caminhão Volvo (modelo FH 540, placa KLL-9090) com POST e confirmar o status 201 Created.

Comando:
```
curl -s -i -X POST http://localhost:$PORTA/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"KLL-9090","montadora":"Volvo","modelo":"FH 540"}'
```

Pra que serve: `-X POST` define o método, `-H` avisa que o corpo é JSON, `-d` manda os dados e `-i` mostra o cabeçalho da resposta. Resultado esperado: `HTTP/1.1 201 Created` e o veículo novo com `"id": 3`.

---

### Exercício 3
O que fazer: Tentar cadastrar um veículo sem o campo `placa` e confirmar o 400 Bad Request.

Comando:
```
curl -s -i -X POST http://localhost:$PORTA/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540"}'
```

Pra que serve: testa a validação. Resultado esperado: `HTTP/1.1 400 Bad Request` e a mensagem dizendo que `placa`, `montadora` e `modelo` são obrigatórios.

---

### Exercício 4
O que fazer: Filtrar os veículos pelo status usando query param.

Comando:
```
curl -s "http://localhost:$PORTA/api/v1/veiculos?status=DISPONIVEL" | jq .
```

Pra que serve: o `?status=DISPONIVEL` é um filtro passado na URL (por isso as aspas). Resultado esperado: só os veículos DISPONIVEL (o Scania de ID 1 e o Volvo de ID 3).

---

### Exercício 5
O que fazer: Atualizar o status do veículo de ID 3 para EM_ROTA com PATCH.

Comando:
```
curl -s -X PATCH http://localhost:$PORTA/api/v1/veiculos/3/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}' | jq .
```

Pra que serve: o PATCH muda só uma parte do veículo (o status). **A URL termina em `/status`**: sem isso a rota não existe e dá erro. Resultado esperado: a mensagem "Status atualizado com sucesso!" e o veículo 3 com `"status": "EM_ROTA"`. Pra conferir:
```
curl -s http://localhost:$PORTA/api/v1/veiculos/3 | jq .
```
(Precisa ter feito o Exercício 2 antes, senão o veículo 3 não existe.)

---

### Exercício 6
O que fazer: Tentar atualizar e deletar um veículo com ID inexistente (99) e validar o 404 Not Found.

Comando:
```
curl -s -i -X DELETE http://localhost:$PORTA/api/v1/veiculos/99

curl -s -i -X PATCH http://localhost:$PORTA/api/v1/veiculos/99/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}'
```

Pra que serve: testa o erro de "não encontrado". Resultado esperado nos dois: `HTTP/1.1 404 Not Found` com a mensagem "Veiculo nao encontrado.".

---

### Exercício 7
O que fazer: Adicionar uma rota PUT (`/api/v1/veiculos/:id`) que substitui todos os dados de um veículo de uma vez.

**Código atualizado - Exercício 7** (frota_api.js completo, com a rota PUT nova no item 6):

Passo 1: parar o servidor.
```
pkill -f frota_api.js
```

Passo 2: recriar o arquivo inteiro (isso sobrescreve o anterior).
```
cat > frota_api.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Banco de dados em memoria
let veiculos = [
    { id: 1, placa: "ABC-1234", montadora: "Scania", modelo: "R450", status: "DISPONIVEL" },
    { id: 2, placa: "XYZ-9876", montadora: "Mercedes-Benz", modelo: "Actros", status: "EM_ROTA" }
];

// 1. GET /api/v1/veiculos - Listar todos os veiculos (Suporta filtro por status query param)
app.get('/api/v1/veiculos', (req, res) => {
    const { status } = req.query;
    if (status) {
        const filtrados = veiculos.filter(v => v.status.toUpperCase() === status.toUpperCase());
        return res.status(200).json(filtrados);
    }
    res.status(200).json(veiculos);
});

// 2. GET /api/v1/veiculos/:id - Buscar veiculo por ID
app.get('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const veiculo = veiculos.find(v => v.id === id);
    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado na base de dados." });
    }
    res.status(200).json(veiculo);
});

// 3. POST /api/v1/veiculos - Cadastrar novo veiculo (Criacao)
app.post('/api/v1/veiculos', (req, res) => {
    const { placa, montadora, modelo } = req.body;
    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }
    const novoVeiculo = {
        id: veiculos.length + 1,
        placa,
        montadora,
        modelo,
        status: "DISPONIVEL"
    };
    veiculos.push(novoVeiculo);
    res.status(201).json(novoVeiculo);
});

// 4. PATCH /api/v1/veiculos/:id/status - Atualizar status do veiculo
app.patch('/api/v1/veiculos/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const veiculo = veiculos.find(v => v.id === id);

    if (!veiculo) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    if (!status) {
        return res.status(400).json({ erro: "O campo 'status' e obrigatorio." });
    }

    veiculo.status = status.toUpperCase();
    res.status(200).json({ mensagem: "Status atualizado com sucesso!", veiculo });
});

// 5. DELETE /api/v1/veiculos/:id - Remover veiculo da frota
app.delete('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = veiculos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    veiculos.splice(index, 1);
    res.status(200).json({ mensagem: `Veiculo ID ${id} removido com sucesso.` });
});

// 6. PUT /api/v1/veiculos/:id - Substituir TODOS os dados do veiculo (NOVO)
app.put('/api/v1/veiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { placa, montadora, modelo, status } = req.body;
    const index = veiculos.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Veiculo nao encontrado." });
    }
    if (!placa || !montadora || !modelo) {
        return res.status(400).json({ erro: "Campos 'placa', 'montadora' e 'modelo' sao obrigatorios." });
    }

    veiculos[index] = {
        id,
        placa,
        montadora,
        modelo,
        status: status ? status.toUpperCase() : "DISPONIVEL"
    };
    res.status(200).json(veiculos[index]);
});

app.listen(PORT, () => {
    console.log(`[Binario Tech] API de Frotas rodando em http://localhost:${PORT}`);
});
EOF
```

Passo 3: subir de novo e testar.
```
PORT=$PORTA node frota_api.js &

curl -s -i -X PUT http://localhost:$PORTA/api/v1/veiculos/1 \
  -H "Content-Type: application/json" \
  -d '{"placa":"NEW-0001","montadora":"Scania","modelo":"R540","status":"DISPONIVEL"}'

curl -s http://localhost:$PORTA/api/v1/veiculos/1 | jq .
```

Pra que serve: o `PUT` **substitui o veículo inteiro** (diferente do `PATCH`, que muda só um campo). Resultado esperado: `HTTP/1.1 200 OK`, e o `GET` seguinte mostra o veículo 1 com a placa `NEW-0001` e modelo `R540`. Se faltar `placa`, `montadora` ou `modelo`, volta 400, e com ID inexistente volta 404.

Lembre: ao reiniciar, os dados voltam ao início (só IDs 1 e 2).

---

### Exercício 8
O que fazer: Criar o script Bash `teste_crud.sh` que cadastra 2 veículos, atualiza 1 e deleta o outro, registrando tudo em `crud_result.log`.

Comando pra criar:
```
cat > teste_crud.sh << 'EOF'
#!/bin/bash
PORTA=${PORTA:-3003}
BASE="http://localhost:$PORTA/api/v1/veiculos"
LOG="crud_result.log"

echo "=== TESTE CRUD - $(date) ===" > $LOG

echo "--- 1. Cadastrando veiculo 1 ---" >> $LOG
R1=$(curl -s -X POST $BASE -H "Content-Type: application/json" -d '{"placa":"AAA-1111","montadora":"Scania","modelo":"R450"}')
echo "$R1" >> $LOG
ID1=$(echo "$R1" | jq -r .id)

echo "--- 2. Cadastrando veiculo 2 ---" >> $LOG
R2=$(curl -s -X POST $BASE -H "Content-Type: application/json" -d '{"placa":"BBB-2222","montadora":"Mercedes-Benz","modelo":"Actros"}')
echo "$R2" >> $LOG
ID2=$(echo "$R2" | jq -r .id)

echo "--- 3. Atualizando status do veiculo $ID1 ---" >> $LOG
curl -s -X PATCH $BASE/$ID1/status -H "Content-Type: application/json" -d '{"status":"EM_ROTA"}' >> $LOG
echo "" >> $LOG

echo "--- 4. Deletando veiculo $ID2 ---" >> $LOG
curl -s -X DELETE $BASE/$ID2 >> $LOG
echo "" >> $LOG

echo "=== FIM DO TESTE ===" >> $LOG
EOF
chmod +x teste_crud.sh
./teste_crud.sh
cat crud_result.log
```

Pra que serve: o script faz o CRUD inteiro sozinho. Ele guarda o ID de cada veículo cadastrado (`jq -r .id`) e usa esses IDs pra atualizar o primeiro e deletar o segundo. O `>` no começo recria o log a cada execução, e o `>>` vai acrescentando cada etapa. O servidor precisa estar rodando.

---

### Extra - script start no package.json
Caso a prova peça (como na Aula 03):

Comando:
```
npm pkg set scripts.start="node frota_api.js"
cat package.json
```

Pra que serve: cria o atalho `"start": "node frota_api.js"`, e daí `npm start` sobe a API.

---

### Entrega - versionar e enviar pro GitHub

Comando:
```
cd ~/binario_tech
git status
git add prova_aula04
git commit -m "prova: aula04 - API RESTful de frota de veiculos"
git push origin main
```

Pra que serve: `git status` mostra o que mudou (o `node_modules` **não** pode aparecer, ele é ignorado pelo `.gitignore` da raiz). `git add prova_aula04` prepara os arquivos da prova, `git commit` grava no histórico e `git push origin main` envia pro GitHub.

Arquivos pra anexar na entrega: `frota_api.js`, `teste_crud.sh` e `crud_result.log`. Baixe do site do GitHub se o trabalho foi feito no servidor via SSH. Print do terminal: a execução do `teste_crud.sh` (com o `cat crud_result.log`) e o `git push` final.

---

### Se der erro

- `Error: listen EADDRINUSE ... :::3003` → já tem um servidor rodando na porta. Rode `pkill -f frota_api.js` e suba de novo.
- `curl: (7) Failed to connect` → o servidor não está rodando. Rode `PORT=$PORTA node frota_api.js &`.
- `Cannot PATCH /api/v1/veiculos/3` → faltou o `/status` no final da URL.
- `jq: parse error` → a resposta não veio em JSON (servidor fora do ar ou URL errada).
- `Cannot find module 'express'` → faltou o `npm install express`, ou você não está dentro da pasta `prova_aula04`.
- O Exercício 5 deu 404 → o veículo 3 não existe (Exercício 2 não feito, ou o servidor foi reiniciado).
- `git push` rejeitado → rode `git pull origin main` e depois `git push origin main` de novo.
- `Please tell me who you are` → configure o Git uma vez:
```
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```


## Aula 05 - Middlewares, Validação e Segurança

### Exercício 1
O que fazer: Fazer uma requisição GET na rota de health e conferir a mensagem do `loggerMiddleware` no terminal.

Comando:
curl -s http://localhost:3003/api/v1/health

Pra que serve: o `loggerMiddleware` é um middleware que registra cada requisição recebida (tipo "GET /api/v1/health - 200 OK") direto no terminal onde o servidor está rodando. Você não vê isso na resposta do curl — tem que olhar na janela onde o `node`/`pm2 logs` está ativo.

---

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

Pra que serve: o `express.Router()` cria um "mini-roteador" separado, que organiza as rotas de manutenções num arquivo próprio em vez de jogar tudo dentro do `app.js` principal — deixa o código mais organizado.

---

### Exercício 3
O que fazer: Registrar o roteador de manutenções no `app.js`, no caminho `/api/v1/manutencoes`, usando o `authMiddleware`.

No `app.js`, adicionar:
const manutencoesRouter = require('./routes/manutencoes');
app.use('/api/v1/manutencoes', authMiddleware, manutencoesRouter);

Pra que serve: `app.use(caminho, middleware, roteador)` conecta o arquivo de rotas criado no Exercício 2 à aplicação principal, só que exigindo que o `authMiddleware` valide a requisição antes de deixar passar pra qualquer rota de manutenções.

---

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

Pra que serve: `/^\d{11}$/` é uma expressão regular (regex) que confere se o valor tem exatamente 11 caracteres, todos números. Se não bater, o middleware já responde com erro e **não chama `next()`** — ou seja, a requisição não chega até a rota final.

---

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

Pra que serve: diferente do Exercício 3 (que aplica middleware em todas as rotas daquele caminho), aqui o middleware é passado só pra uma rota específica, como segundo argumento antes da função final — assim só o cadastro de motorista passa por essa validação.

---

### Exercício 6
O que fazer: Acessar uma rota que não existe (`/api/v1/clientes`) e confirmar que o middleware global de 404 responde em JSON.

Comando:
curl -s -i http://localhost:3003/api/v1/clientes

Pra que serve: testa se a API tem um "middleware catch-all" (geralmente o último do `app.js`) que intercepta qualquer rota não cadastrada e devolve um JSON padronizado de erro, em vez do HTML feio padrão do Express.

---

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

Pra que serve: simula uma auditoria de segurança real — testa repetidamente o acesso sem autorização (deve sempre barrar) e confirma que, com a chave certa, a API libera o acesso. Troca `SUA_CHAVE_AQUI` pela chave de API real que o `authMiddleware` espera.

---

### Exercício 8
O que fazer: Achar o PID do processo da API e encerrar.

Comando:
ps aux | grep node
kill -9 <PID>

Pra que serve: mesma lógica de antes — lista processos, filtra por "node", e mata usando o PID encontrado (troca `<PID>` pelo número real).



## Aula 06 - Persistência em Arquivo JSON (Ocorrências)

### Exercício 1
O que fazer: Fazer uma requisição GET na rota `/api/v1/ocorrencias` via httpie e confirmar que a resposta é um array com os dados do `ocorrencias.json`.

Comando:
http GET http://localhost:3003/api/v1/ocorrencias

Pra que serve: o `httpie` faz a requisição e já mostra a resposta formatada e colorida. Como a rota lê o conteúdo do `ocorrencias.json`, a resposta deve vir como uma lista `[ {...}, {...} ]` — confirmando que a API está lendo o arquivo corretamente.

---

### Exercício 2
O que fazer: Usar o `jq` pra filtrar, dentro do `ocorrencias.json`, só os registros da montadora "Scania".

Comando:
cat ocorrencias.json | jq '.[] | select(.montadora == "Scania")'

Pra que serve: `.[]` passa por cada item do array. O `select(.montadora == "Scania")` filtra e deixa passar só os objetos onde o campo `montadora` for exatamente "Scania", descartando o resto.

---

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

Pra que serve: `:nome` na rota é um "parâmetro de rota" — tudo que vier depois de `/montadora/` na URL é capturado em `req.params.nome`. O `fs.readFileSync` lê o arquivo JSON direto do disco toda vez que a rota é chamada.

---

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

Pra que serve: diferente das aulas anteriores (onde os dados ficavam só na memória), aqui a remoção precisa ser **persistida** — por isso usa `fs.writeFileSync` pra reescrever o arquivo inteiro sem o item removido, senão o dado "voltaria" se o servidor reiniciasse.

---

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

Pra que serve: `pkill -f "node"` mata qualquer processo que tenha "node" no comando que o iniciou (mais direto que achar o PID manualmente com `ps aux`). O `rm -f` apaga o arquivo de dados sem pedir confirmação, deixando tudo limpo pra começar os testes do zero.



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

Pra que serve: separar em **controller** (a lógica do que cada rota faz) e **routes** (só a definição dos caminhos) é o padrão MVC — deixa o código organizado conforme o projeto cresce, em vez de misturar tudo no `server.js`.

---

### Exercício 2
O que fazer: Conectar o roteador da Mercedes no `server.js`, no caminho `/api/v1/telemetria/mercedes`.

No `server.js`:
const mercedesRoutes = require('./src/routes/mercedesRoutes');
app.use('/api/v1/telemetria/mercedes', mercedesRoutes);

Comando pra testar:
curl -s http://localhost:3003/api/v1/telemetria/mercedes | jq .

Pra que serve: liga o arquivo de rotas criado no Exercício 1 à aplicação principal — sem essa linha, as rotas existem no código mas o Express nunca saberia que precisa usá-las.

---

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

Pra que serve: mesma lógica do `validaCnh` da Aula 05, só que validando o tamanho do código VIN/Chassi em vez de um padrão de dígitos — confere o `.length` em vez de usar regex, já que aqui pode ter letras e números misturados.

---

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

Pra que serve: aplica a validação só nessa rota específica (passando o middleware como segundo argumento), e o teste confirma que um VIN curto demais ("123", só 3 caracteres) é rejeitado com 400.

---

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

Pra que serve: automatiza a checagem de todas as rotas da API numa tacada só — útil pra confirmar rapidinho que nada quebrou depois de uma mudança no código, e deixa tudo registrado no `auditoria.log` como prova.



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

Pra que serve: `db('veiculos')` é o jeito do Knex de "apontar" pra uma tabela do banco. `.where({ id }).first()` monta um SQL tipo `SELECT * FROM veiculos WHERE id = ? LIMIT 1` e devolve só o primeiro resultado (ou `undefined` se não achar nada — por isso o `if (!veiculo)`).

---

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

Pra que serve: `.update({ status })` monta um `UPDATE veiculos SET status = ? WHERE id = ?` e retorna **quantas linhas** foram alteradas — se vier `0`, é porque nenhum veículo com aquele ID existia, daí o 404.

---

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

Pra que serve: uma **migration** é um "histórico versionado" de mudanças no banco — em vez de criar a tabela direto no SQLite na mão, você escreve o código que cria ela, e o Knex aplica isso de forma controlada (e reversível, usando o `exports.down`).

---

### Exercício 4
O que fazer: Reverter a última migration (`rollback`) e reaplicar em seguida (`migrate:latest`).

Comando:
npx knex migrate:rollback
npx knex migrate:latest

Pra que serve: o `rollback` desfaz a última migration aplicada (executando o `exports.down` dela — no caso, apagaria a tabela `motoristas`). O `migrate:latest` reaplica todas as migrations pendentes (recriando a tabela). Serve pra provar que a migration funciona nos dois sentidos: criar e desfazer.



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

Pra que serve: diferente do `.first()` usado antes, aqui `.where({ veiculo_id: id })` sem `.first()` retorna um **array** com todas as leituras daquele veículo — pode ter zero, uma ou várias linhas de telemetria associadas ao mesmo `veiculo_id`.

---

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

Pra que serve: antes de inserir a telemetria, o controller confere se o `veiculo_id` informado realmente existe na tabela `veiculos` — isso é uma validação de **integridade referencial** feita na aplicação (equivalente ao que uma foreign key faria no banco).

---

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

Pra que serve: `req.query.alerta` captura o valor depois do `?` na URL (vem sempre como texto, por isso compara com a string `'true'`). O filtro `.where('temperatura_motor', '>', 95)' só é aplicado **se** o parâmetro `alerta=true` for passado — sem ele, a query roda normal e traz tudo.

---

### Exercício 4
O que fazer: Inserir um veículo Volkswagen modelo Delivery, e depois duas leituras de telemetria pra esse veículo.

Comando pra cadastrar o veículo:
curl -s -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Volkswagen", "modelo": "Delivery", "placa": "VWD-0001"}'

(Anota o `id` que a resposta retornar — vamos chamar de `<ID_DO_VEICULO>` abaixo.)

Comando pra inserir as duas leituras:
curl -s -X POST http://localhost:3003/api/v1/telemetria \
  -H "Content-Type: application/json" \
  -d '{"veiculo_id": <ID_DO_VEICULO>, "temperatura_motor": 88, "velocidade": 70}'

curl -s -X POST http://localhost:3003/api/v1/telemetria \
  -H "Content-Type:



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

Pra que serve: diferente de um seed comum (que começa com `.del()` pra limpar a tabela), esse não tem `.del()` de propósito — só insere linhas novas, preservando o que já estava no banco. O `--specific` roda só esse arquivo.

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

Pra que serve: esse middleware tem 4 parâmetros (`err, req, res, next`) — é assim que o Express reconhece um "error handler". Quando o `express.json()` não consegue interpretar um JSON malformado, cai aqui em vez de travar o servidor.

### Exercício 3
O que fazer: Criar o script `"db:reset"` no `package.json`, rodando rollback, migrate e seed em sequência.

No `package.json`, dentro de `"scripts"`:
"db:reset": "knex migrate:rollback --all && knex migrate:latest && knex seed:run"

Comando pra testar:
npm run db:reset

Pra que serve: o `&&` encadeia os comandos, cada um só roda se o anterior tiver sucesso — reseta o banco inteiro numa tacada só (desfaz migrations, reaplica, repovoa com seeds).

### Exercício 4
O que fazer: Tentar inserir um veículo sem o campo `placa` e confirmar que o validador retorna 400.

Comando:
curl -s -i -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Scania", "modelo": "R450"}'

Pra que serve: mesmo teste de validação da Aula 04 — confirma que o controller de veículos continua rejeitando cadastro incompleto, mesmo com as mudanças de banco feitas nessa aula.


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

Pra que serve: `Alerta.find({...})` é a sintaxe do Mongoose pra buscar documentos no MongoDB que batem com um filtro — aqui filtra pelo campo `nivelSeveridade`, usando o valor vindo da URL (`req.params.nivel`).

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

Pra que serve: `[String]` no Mongoose define que o campo aceita uma **lista** de textos (ex: `['superaquecimento', 'manutencao_urgente']`), em vez de um texto único — útil pra marcar um alerta com várias categorias ao mesmo tempo.

### Exercício 3
O que fazer: Tentar inserir um alerta com `nivelSeveridade: 'INVALIDO'` e observar o erro de validação do Enum.

Comando:
curl -s -i -X POST http://localhost:3003/api/v1/alertas \
  -H "Content-Type: application/json" \
  -d '{"nivelSeveridade": "INVALIDO", "descricao": "teste"}'

Pra que serve: um campo `enum` no Schema (ex: `enum: ['BAIXO', 'MEDIO', 'ALTO']`) restringe os valores aceitos — o Mongoose recusa automaticamente qualquer valor fora da lista, retornando uma mensagem de erro de validação sem precisar de `if` manual no controller.

### Exercício 4
O que fazer: Inserir um alerta com severidade `'BAIXO'` e metadados customizados (tipo de carga, velocidade).

Comando:
curl -s -X POST http://localhost:3003/api/v1/alertas \
  -H "Content-Type: application/json" \
  -d '{"nivelSeveridade": "BAIXO", "descricao": "Alerta de rotina", "metadados": {"tipoCarga": "Granel", "velocidade": 80}}'

Pra que serve: testa que o Schema aceita dados extras dentro de um objeto (`metadados`), além dos campos fixos — útil pra guardar informações variáveis sem precisar mudar o Schema toda hora.


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

Pra que serve: `$regex` faz uma busca por **padrão de texto** em vez de valor exato — mesmo que o banco tenha "ABC-1234", buscar por "abc" encontra. O `$options: 'i'` ("i" de insensitive) ignora maiúsculas/minúsculas.

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

Pra que serve: `$push` é o operador do MongoDB que **adiciona um item ao final de um array** existente, sem precisar reescrever o array inteiro. O `runValidators: true` garante que a validação do Schema (como a do Exercício 3) também rode nessa operação de update.

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

Pra que serve: `min: [0, "mensagem"]` é um validador nativo do Mongoose pra números — rejeita automaticamente qualquer valor menor que 0, com a mensagem de erro customizada.

### Exercício 4
O que fazer: Deletar uma manutenção pelo `_id` e confirmar o 200 com mensagem de confirmação.

Comando:
curl -s -i -X DELETE http://localhost:3003/api/v1/manutencoes/<ID>

Pra que serve: testa a exclusão de um documento no MongoDB pelo identificador único (`_id`, gerado automaticamente pelo Mongo) — confirma que a API responde com sucesso (200) e uma mensagem amigável, em vez de só um corpo vazio.


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

Pra que serve: `.toUpperCase()` aqui é um **sanitizador** (diferente de um validador) — ele não rejeita o dado, só transforma ele antes de seguir, garantindo que "abc-1234" vire "ABC-1234" automaticamente no banco.

### Exercício 2
O que fazer: Adicionar o campo opcional `anoFabricacao`, validando que seja número inteiro entre 2000 e o ano atual (se for enviado).

Na lista de validação:
body('anoFabricacao')
  .optional()
  .isInt({ min: 2000, max: new Date().getFullYear() })
  .withMessage(`Ano deve estar entre 2000 e ${new Date().getFullYear()}`)

Pra que serve: `.optional()` faz essa regra só rodar **se o campo for enviado** — se o cliente não mandar `anoFabricacao`, a validação é pulada sem erro. `isInt({ min, max })` confere se é um número inteiro dentro do intervalo.

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

Pra que serve: confere o cabeçalho da requisição antes mesmo dela chegar nas rotas — uma camada extra de proteção pra garantir que a API só processe requisições realmente enviando JSON.

### Exercício 4
O que fazer: Enviar um payload incorreto e usar `jq` pra filtrar só a lista de mensagens de erro.

Comando:
curl -s -X POST http://localhost:3003/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora": "Scania"}' | jq '.erros[].msg'

Pra que serve: quando o `express-validator` encontra múltiplos erros, geralmente devolve um array deles (ex: `{"erros": [{"msg": "..."}]}`). O `jq '.erros[].msg'` entra nesse array e extrai só o texto da mensagem de cada erro, ignorando o resto da estrutura.


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

Pra que serve: é uma **função que retorna um middleware** (padrão chamado "middleware factory") — permite reutilizar a mesma lógica passando perfis diferentes pra cada rota, sem duplicar código.

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

Pra que serve: `expiresIn: '15s'` define quanto tempo o token é válido. O `sleep 16` força o terminal a esperar mais que isso antes da segunda requisição, provocando o erro de "token expirado" (geralmente um 401, vindo do `jwt.verify` lançando `TokenExpiredError`).

### Exercício 3
O que fazer: Enviar uma senha com menos de 6 caracteres no registro e confirmar que é rejeitada com 400.

Comando:
curl -s -i -X POST http://localhost:3003/api/v1/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@teste.com", "senha": "123"}'

Pra que serve: testa a regra de validação de senha mínima (geralmente configurada com `isLength({ min: 6 })` no express-validator ou uma checagem manual no controller) — segurança básica pra não deixar o usuário cadastrar senha fraca demais.

### Exercício 4
O que fazer: Enviar um token JWT corrompido/alterado manualmente e confirmar que retorna 403 Forbidden.

Comando:
curl -s -i http://localhost:3003/api/v1/veiculos \
  -H "Authorization: Bearer token.invalido.corrompido"

Pra que serve: testa se o middleware de autenticação rejeita corretamente um token que não bate com a assinatura esperada (`jwt.verify` lança erro quando o token foi adulterado), protegendo contra tentativas de falsificação de identidade.



## Aula 16 - Git Pull, .gitignore e Auditoria de Processos

### Exercício 1
O que fazer: Subir uma alteração simples no Cloud Shell, rodar `git pull origin main` no servidor da sala e confirmar que o arquivo atualizou.

Comando:
git pull origin main
cat <nome_do_arquivo_alterado>

Pra que serve: `git pull` busca as mudanças do repositório remoto (GitHub) e já aplica no seu ambiente local — o `cat` depois só confirma visualmente que o conteúdo novo chegou.

### Exercício 2
O que fazer: Criar o `.gitignore` na raiz da pasta `binario_tech`, ignorando `node_modules` e `.env` de todas as aulas.

Comando:
cat > ~/curso-pbe1/binario_tech/.gitignore << 'EOF'
node_modules/
.env
EOF

Pra que serve: um `.gitignore` na raiz do repositório vale pra **todas as subpastas** (todas as aulas) de uma vez só — evita subir dependências pesadas (`node_modules`) e dados sensíveis (`.env`) pro GitHub.

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

Pra que serve: automatiza a checagem de quais processos Node estão rodando no servidor, salvando um registro datado em arquivo — útil pra auditoria sem precisar rodar o comando manual toda vez.

### Exercício 4
O que fazer: Commitar o `auditoria_servidor.sh`, dar push, e confirmar na interface do GitHub que a pasta `aula16` foi publicada.

Comando:
git add .
git commit -m "feat: aula16 - script de auditoria de processos"
git push origin main

Pra que serve: sobe o script pro repositório remoto. A validação final é visual — abrir o GitHub no navegador e conferir se a pasta `aula16` e o arquivo aparecem lá.


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

Pra que serve: `-w "%{http_code}"` faz o curl devolver só o código de status HTTP (tipo 200), ignorando o corpo da resposta. Isso é gravado no log como prova do teste.

### Exercício 2
O que fazer: Criar o endpoint POST `/api/v1/auth/token-teste`, gerando um JWT válido por 5 minutos.

No servidor:
app.post('/api/v1/auth/token-teste', (req, res) => {
  const token = jwt.sign({ usuario: "teste" }, process.env.JWT_SECRET, { expiresIn: '5m' });
  res.json({ token });
});

Comando pra testar:
curl -s -X POST http://localhost:3003/api/v1/auth/token-teste | jq .

Pra que serve: gera um token rápido só pra testes do simulado, sem precisar passar por login/senha de verdade — `expiresIn: '5m'` limita a validade a 5 minutos.

### Exercício 3
O que fazer: Usar o token do Exercício 2 pra acessar `/api/v1/simulado/status` e extrair só o nome do usuário.

Comando:
TOKEN=$(curl -s -X POST http://localhost:3003/api/v1/auth/token-teste | jq -r .token)
curl -s http://localhost:3003/api/v1/simulado/status \
  -H "Authorization: Bearer $TOKEN" | jq -r .usuario

Pra que serve: guarda o token numa variável (`$TOKEN`) pra reutilizar na segunda chamada. O `jq -r .usuario` extrai só o nome, sem aspas e sem o resto do JSON.

### Exercício 4
O que fazer: Rodar `git status` e garantir que a árvore de trabalho esteja limpa antes de encerrar.

Comando:
git status

Pra que serve: confirma que tudo que foi alterado já foi commitado e enviado — se aparecer "nothing to commit, working tree clean", está tudo certo pra finalizar a aula.


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

Pra que serve: `bcrypt.hash(senha, 10)` embaralha a senha de forma irreversível antes de salvar no banco — o "10" é o número de voltas do algoritmo (quanto maior, mais seguro e mais lento). Nunca se salva senha em texto puro.

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

Pra que serve: `bcrypt.compare` confere a senha digitada contra o hash salvo (nunca descriptografa o hash, só compara). Se bater, gera o token com validade de 30 minutos.

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

Pra que serve: diferencia dois cenários de erro — **401 (Unauthorized)** quando nem tentou se autenticar (sem token), e **403 (Forbidden)** quando tentou mas o token não é válido. É uma distinção comum em provas.

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

Pra que serve: automatiza o fluxo completo de teste (registro → login → acesso protegido) numa tacada só, provando que todas as 3 questões anteriores funcionam juntas.


## Aula 19 - PM2: Memória, Ecosystem e Persistência

### Exercício 1
O que fazer: Limitar o processo `api-telemetria` a 100MB de memória com `--max-memory-restart`.

Comando:
pm2 delete api-telemetria
pm2 start server.js --name "api-telemetria" --max-memory-restart 100M
pm2 describe api-telemetria

Pra que serve: o PM2 passa a monitorar o consumo de RAM — se o processo passar de 100MB, ele é morto e reiniciado automaticamente, evitando que uma aplicação com vazamento de memória derrube o servidor inteiro.

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

Pra que serve: centraliza toda a configuração do PM2 num arquivo só, em vez de passar flags toda vez na linha de comando — `env` e `env_production` guardam variáveis diferentes pra cada ambiente.

### Exercício 3
O que fazer: Salvar a lista de processos do PM2 pra persistir após reinicialização do sistema.

Comando:
pm2 save

Pra que serve: tira um "retrato" da lista atual de processos rodando, salvando num arquivo (`dump.pm2`) — isso permite recuperar o mesmo estado depois, caso o servidor reinicie.

### Exercício 4
O que fazer: Commit e push das alterações da `aula19` pro GitHub.

Comando:
git add .
git commit -m "feat: aula19 - PM2, limite de memoria e ecosystem.config.js"
git push origin main

Pra que serve: versiona e envia todo o trabalho da aula 19 pro repositório remoto, seguindo o mesmo fluxo Git das aulas anteriores.



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

Pra que serve: o `return 200 '...'` faz o próprio Nginx responder direto, sem nem acionar o `proxy_pass` — mostra que o Nginx pode servir conteúdo estático/fixo sem depender do Node pra tudo.

### Exercício 2
O que fazer: Adicionar `client_max_body_size 2M;` no Nginx, pra barrar requisições com payload maior que 2MB.

No bloco `server` do `binario_aluno.conf`:
client_max_body_size 2M;

Comando pra testar (manda ~3MB de propósito):
curl -s -i -X POST http://localhost:8080/api/v1/proxy/ \
  -H "Content-Type: application/json" \
  -d "$(head -c 3000000 /dev/zero | tr '\0' 'a')"

Pra que serve: protege o servidor contra payloads excessivos (um ataque comum ou erro de cliente) — o Nginx barra **antes** da requisição chegar no Node, com `413 Request Entity Too Large`.

### Exercício 3
O que fazer: Script `analisar_logs_nginx.sh` que lê as últimas 15 linhas do log de acesso e filtra só as com status 200.

Comando pra criar:
cat > analisar_logs_nginx.sh << 'EOF'
#!/bin/bash
echo "=== Últimas 15 linhas com status 200 OK ==="
sudo tail -n



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

Pra que serve: simula o fluxo real de deploy — muda o código, commita, e deixa o script `deploy.sh` cuidar de puxar, instalar dependências e reiniciar o processo sozinho. O `curl` final confirma que a versão nova realmente "pegou" no servidor rodando.

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

Pra que serve: `git rev-parse --short HEAD` pega os primeiros caracteres do hash do commit atual — isso cria um histórico rastreável de qual versão exata do código foi publicada em cada deploy, útil pra auditoria ou pra saber rapidinho "qual commit tá em produção agora".

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

Pra que serve: Git Hooks são scripts que o próprio Git executa sozinho em certos eventos — o `post-commit` roda automaticamente logo depois que qualquer commit é finalizado, sem precisar chamar `./deploy.sh` manualmente. É assim que uma esteira de CI/CD de verdade funciona.

### Exercício 4
O que fazer: Commit e push dos arquivos da `aula21` (`server.js`, `deploy.sh`, `package.json`) pro GitHub.

Comando:
git add .
git commit -m "feat: aula21 - pipeline de deploy, log de historico e git hook post-commit"
git push origin main

Pra que serve: versiona e envia pro repositório remoto todo o trabalho da aula — o pipeline de deploy, o script com o log de histórico, e a configuração do hook (o próprio arquivo do hook, por padrão, fica fora do controle de versão do Git, mas o script `deploy.sh` que ele chama vai junto).
