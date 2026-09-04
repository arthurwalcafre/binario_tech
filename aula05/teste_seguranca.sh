#!/bin/bash

LOGFILE="audit_seguranca.log"

echo "===== AUDITORIA DE SEGURANÇA =====" > $LOGFILE
echo "Data/Hora: $(date)" >> $LOGFILE
echo "-----------------------------------" >> $LOGFILE

for i in {1..3}; do
  echo "[$i] Tentativa SEM chave de API ($i/3)..." >> $LOGFILE
  curl -s -i http://localhost:3000/api/v1/manutencoes >> $LOGFILE
  echo -e "\n\n" >> $LOGFILE
done

echo "[4] Tentativa COM chave válida..." >> $LOGFILE
curl -s -i -H "x-api-key: binario-tech-secret-2026" http://localhost:3000/api/v1/manutencoes >> $LOGFILE
echo -e "\n\n" >> $LOGFILE

echo "===== AUDITORIA FINALIZADA =====" >> $LOGFILE

