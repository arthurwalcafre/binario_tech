#!/bin/bash
echo "=== Limpeza do ambiente Docker ==="

# Containers inativos (parados ou criados que nunca rodaram)
INATIVOS=$(docker ps -aq --filter "status=exited" --filter "status=created")
if [ -n "$INATIVOS" ]; then
  docker stop $INATIVOS > /dev/null 2>&1
  docker rm $INATIVOS
  echo "[OK] Containers inativos removidos."
else
  echo "[INFO] Nenhum container inativo encontrado."
fi

# Imagens pendentes (dangling)
PENDENTES=$(docker images -q --filter "dangling=true")
if [ -n "$PENDENTES" ]; then
  docker rmi $PENDENTES
  echo "[OK] Imagens pendentes removidas."
else
  echo "[INFO] Nenhuma imagem pendente encontrada."
fi

echo "=== Limpeza concluída ==="
