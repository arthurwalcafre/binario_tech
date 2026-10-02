#!/bin/bash
echo "=== Últimas 15 linhas com status 200 OK ==="
sudo tail -n 15 /var/log/nginx/access.log | grep ' 200 '
