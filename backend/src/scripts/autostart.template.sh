#!/usr/bin/env bash 

# Reemplazar estas variables con tus valores!
REPO_DIR="/home/gabriel/Facturacion"
LOG_PATH="/home/gabriel/.facturacion.log"
SCP_DEST="gabriel@192.168.0.5:~"

{ 
    cd $REPO_DIR
    git pull origin master 

    # hacer build del frontend
    cd frontend 
    make 

    cd  ../backend 
    # respaldar base de datos
    node src/scripts/backupDB.js $SCP_DEST
    # levantar servidor
    node src/server.js 

} 2>&1 | tee -a $LOG_PATH
