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
