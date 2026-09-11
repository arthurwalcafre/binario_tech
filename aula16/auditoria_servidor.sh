#!/bin/bash
echo "=== Auditoria de processos Node.js - $(date) ==="
ps aux | grep node >> processos.log
echo "Auditoria concluída. Resultado salvo em processos.log"
cat processos.log


