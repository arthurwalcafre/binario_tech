#!/bin/bash
echo "===================================================="
echo " AUDITORIA DE BANCO DE DADOS SQLITE - BINARIO TECH"
echo "===================================================="

echo -e "\n[1] Cadastrando veiculo Scania..."
curl -s -X POST http://localhost:3000/api/vl/veiculos \-H "Content-Type: application/json" \-d'{"placa": "SCA-2026","montadora":"Scania","modelo":"R500"}' | jq .

echo -e "\n[2] Cadastrando veiculo Mercedes-Benz..."
curl -s -X POST http://localhost:3000/api/vl/veiculos \-H "Content-Type: application/json" \-d'{"placa":"MBB-2026","montadora":"Mercedes-Benz","modelo":"Actros 2651"}' \ jq .

echo -e "\n[3] Listando todos os veiculos gravados no banco relacional..."
curl -s http://localhost:3000/api/vl/veiculos | jq .
