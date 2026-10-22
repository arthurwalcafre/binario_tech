#!/bin/bash
URL="http://localhost:3003/api/v1/motoristas"
CHAVE="binario-tech-secret-2026"
LOG="audit_seguranca.log"

> "$LOG"

# 401 - sem chave
curl -s -w "\nHTTP %{http_code}\n" "$URL" >> "$LOG"

# 400 - CNH invalida
curl -s -w "\nHTTP %{http_code}\n" -X POST "$URL" \
  -H "X-API-KEY: $CHAVE" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","cnh":"123","categoria":"E"}' >> "$LOG"

# 404 - rota inexistente
curl -s -w "\nHTTP %{http_code}\n" http://localhost:3003/api/v1/clientes >> "$LOG"

# 201 - cadastro com chave valida
curl -s -w "\nHTTP %{http_code}\n" -X POST "$URL" \
  -H "X-API-KEY: $CHAVE" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Roberto Souza","cnh":"55544433322","categoria":"E"}' >> "$LOG"

# 200 - consulta com chave valida
curl -s -w "\nHTTP %{http_code}\n" -H "X-API-KEY: $CHAVE" "$URL" >> "$LOG"
