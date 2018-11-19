[![CircleCI](:https://circleci.com/gh/GAumala/Facturacion.svg?style=svg)](https://circleci.com/gh/GAumala/Facturacion) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Sistema de facturación web sencillo escrito con React, Node.js y SQLite 3.

Se recomienda usar versiones actuales de Google Chrome (>=56) o Firefox (>= 54) para el cliente.

![screenshot1](https://cloud.githubusercontent.com/assets/5729175/24410708/5fa3bcaa-1399-11e7-9cf7-378244afe11d.png)

## Dependencias

Este sistema solo ha sido probado en Linux, debería de funcionar en cualquier distro que cumpla las siguientes dependencias:

- Node.js (>= 8.12)
- Yarn (>= 1.10)
- SQLite 3

## Setup

Primero, clona este repositorio e instala el paquete.

```bash
git clone https://github.com/GAumala/Facturacion
cd Facturacion
yarn install 
```
Segundo, crea el build de producción del React App. 

```bash
cd frontend
yarn build
```

Tercero, crea la base de datos.

```bash
cd backend
yarn build
```

Ahora solo falta levantar el servidor

```bash
yarn server
```

Puedes entrar al sistema desde Google Chrome o Firefox con la siguiente URL: http://localhost:8192

## Configurar actualizaciones automáticas

Este repositorio incluye un [makefile](https://en.wikipedia.org/wiki/Makefile) con el cual se pueden detectar cambios en el código del frontend y generar un nuevo build. La idea es usarlo cada vez que haces `git pull`. Para configurar actualizaciones automáticas simplemente corre el siguiente script periodicamente, o tras encender el servidor:

``` bash
git pull origin master
make
```

## Configurar respaldos automáticos

Es posible respaldar la base de datos con un servidor remoto usando `scp` si el usuario que corre la aplicación tiene llaves ssh autorizadas. 

Para realizar un respaldo manual:

``` bash
# Hay que pasar la url de destino como parametro
# La url debe tener el formato esperado por scp
node src/scripts/backupDB.js user@myremoteserver.com:~
```

Para automatizar respaldos diarios basta con correr `crontab -e` y agregar esta línea:

```
# Respaldar todos los días a las 6 de la tarde 
0 18 * * * /usr/bin/node /path/to/backupDB.js user@myremoteserver.com:~
```
