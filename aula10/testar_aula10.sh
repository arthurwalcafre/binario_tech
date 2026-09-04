#!/bin/bash
echo "===================================================="
echo " AUDITORIA DE SEEDS E TRATAMENTO DE ERROS - AULA 10"
echo "===================================================="

echo -e "\n[1] Consultando dados pré-populados pelo Seed..."
curl -s http://localhost:300/api/vl/frota | jq .

echo -e "\n[2] Testando erro de placa duplicada (Conflito - Status 409)..."
curl -s https://localhost:300/api/v1/frota/veiculo \
       -H "Content-Type: application/json" \
       -d '{"placa":"VOL-1010", "montadora":"Volvo","modelo":"FH-540"}' | jq .

