HEAD
#!/bin/bash
echo "=== Auditoria de processos Node.js - $(date) ==="
ps aux | grep node >> processos.log
echo "Auditoria concluída. Resultado salvo em processos.log"
cat processos.log


=======
echo"=================================================================="
echo" AUDITORIA DE LISTAGEM DO STATUS DE EXECUÇÃO DE PROCESSOS NODE.JS "
echo"=================================================================="

echo "Listando status de execucao dos processos Node.js"
ps aux | grep node >> ./processo.log

echo"Resultado da lista:"
sleep 1
cat processos.log
>>>>>>> 8aa4939 (Aula 18)
