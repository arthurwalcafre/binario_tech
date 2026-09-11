#!/bin/bash
echo "=== Auditoria de processos Node.js - $(date) ===" > processos.log
ps aux | grep node >> processos.log
echo "Auditoria concluída. Resultado salvo em processos.log"
