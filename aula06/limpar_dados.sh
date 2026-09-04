#!/bin/bash

echo "Limpando o ambiente de testes..."

# Tenta encerrar os processos do Node.js (silencia o erro se não houver nenhum rodando)
if pkill node; then
    echo "[OK] Processos Node.js encerrados."
else
    echo "[-] Nenhum processo Node.js rodando no momento."
fi

# Exclui o arquivo ocorrencias.json (o -f evita erros se o arquivo não existir)
if rm -f ocorrencias.json; then
    echo "[OK] Arquivo ocorrencias.json excluído."
fi

echo "Ambiente resetado com sucesso!"
