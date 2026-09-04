#!/bin/bash

echo "===== TESTE DO SERVIDOR ====="

echo
echo "Horário: $(date)"
echo "Testando /status"
curl http://localhost:3000/status

echo
echo "Horário: $(date)"
echo "Testando /scania/info"
curl http://localhost:3000/scania/info

echo
echo "Horário: $(date)"
echo "Testando /vw/info"
curl http://localhost:3000/vw/info

echo
echo "===== FIM DOS TESTES ====="
