#!/bin/bash

LOGFILE="crud_result.log"

echo "===== INICIANDO TESTE CRUD =====" > $LOGFILE
echo "Data/Hora: $(date)" >> $LOGFILE
echo "---------------------------------" >> $LOGFILE

echo "[1] Cadastrando Veículo 1..." >> $LOGFILE
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Scania","modelo":"R450","placa":"ABC-1234"}' >> $LOGFILE
echo -e "\n" >> $LOGFILE

echo "[2] Cadastrando Veículo 2..." >> $LOGFILE
curl -s -X POST http://localhost:3000/api/v1/veiculos \
  -H "Content-Type: application/json" \
  -d '{"montadora":"Volvo","modelo":"FH 540","placa":"KLL-9090"}' >> $LOGFILE
echo -e "\n" >> $LOGFILE

echo "[3] Atualizando status do Veículo 1 para EM_ROTA..." >> $LOGFILE
curl -s -X PATCH http://localhost:3000/api/v1/veiculos/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"EM_ROTA"}' >> $LOGFILE
echo -e "\n" >> $LOGFILE

echo "[4] Deletando Veículo 2..." >> $LOGFILE
curl -s -X DELETE http://localhost:3000/api/v1/veiculos/2 >> $LOGFILE
echo -e "\n" >> $LOGFILE

echo "===== TESTES FINALIZADOS =====" >> $LOGFILE
