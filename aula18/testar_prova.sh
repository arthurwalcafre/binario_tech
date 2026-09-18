#!/bin/bash
BASE="http://localhost:3000/api/v1/prova"

echo "Registrando usuário..."
curl -s -X POST "$BASE/register" -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","senha":"123456"}' | jq

echo "Fazendo login..."
RESPOSTA=$(curl -s -X POST "$BASE/login" -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","senha":"123456"}')

TOKEN=$(echo "$RESPOSTA" | jq -r '.token')
echo "Token: $TOKEN"

echo "Acessando rota protegida..."
curl -s -X GET "$BASE/relatorio" -H "Authorization: Bearer $TOKEN" | jq
