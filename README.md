[![CircleCI](https://circleci.com/gh/GAumala/Facturacion.svg?style=svg)](https://circleci.com/gh/GAumala/Facturacion) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Sistema de facturación web sencillo escrito con React, Node.js y SQLite 3. Emite comprobantes electrónicos usando [Dátil](https://datil.co).

Se recomienda usar versiones actuales de Google Chrome (>=56) o Firefox (>= 54) para el cliente.

![Screenshot_2020-07-19 Facturación](https://user-images.githubusercontent.com/5729175/87880910-27155c00-c9bb-11ea-8858-a468b9c65aab.png)

## Dependencias

Este sistema solo ha sido probado en Linux, debería de funcionar en cualquier sistema que cumpla las siguientes dependencias:

- Node.js (>= 10.13)
- Yarn (>= 1.10)
- SQLite 3

## Setup

1. Clona este repositorio linkea el paquete `common` antes de instalar los demás paquetes.

```bash
git clone https://github.com/GAumala/Facturacion
cd Facturacion/common
yarn 
yarn link 

cd ../backend
yarn link facturacion_common
yarn

cd ../frontend
yarn link facturacion_common
yarn
```
2. Crea el build de producción del React App. 

```bash
cd frontend
yarn build
```

3. Crea la base de datos.

```bash
cd backend
yarn init-db
```

4. Crea los archivos de configuración `datil.config.js` y `system.config.js` en la raíz del proyecto:

``` JavaScript
// datil.config.js
// Aquí se configuran varios datos que se envían a Dátil para emitir
// comprobantes como se especifica en https://datil.dev/#facturas
const emision = {
  ambiente: 1, // pruebas
  moneda: 'USD',
  tipo_emision: 1, // normal
  emisor: {
    ruc: '__MI_RUC__',
    razon_social: '__MI_RAZON_SOCIAL__',
    nombre_comercial: '__MI_NOMBRE_COMERCIAL__',
    direccion: '__MI_DIRECCION__',
    contribuyente_especial: '',
    obligado_contabilidad: true,
    establecimiento: {
      codigo: '001',
      punto_emision: '001',
      direccion: '__MI_DIRECCION__',
    }
  }
};

const apiKey = '__MI_API_KEY__';
const password = '__MI_PASSWORD__';
const codigoIVA = '2' // 12%

module.exports = {
  emision, apiKey, password, codigoIVA
};
```

``` JavaScript
// system.config.js
// En este archivo se pueden configurar varias empresas para facturar con cada 
// una. Sólo la primera puede emitir comprobantes con datil, y esta debe tener
// el mismo nombre indicado en `razon_social` en `datil.config.js`.
module.exports = {
  empresas: [ '__MI_RAZON_SOCIAL__', 'Otra empresa' ]
}
```

Ahora solo falta levantar el servidor:

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

## Autostart

Si el servidor es una computadora personal que se apaga al final de cada día es muy util levantar el servidor automáticamente cada vez que se enciende la computadora. Para esto podemos usar [XDG Autostart](https://wiki.archlinux.org/index.php/XDG_Autostart).

El archivo `backend/scripts/autostart.template.sh` es un script que realiza las siguentes tareas en orden:

- Busca actualizaciones
- respalda la base de datos
- levanta el servidor en background

Para usarlo, solo es necesario que lo copies a algún lugar de tu path y reemplazes las variables declaradas al inicio para que se ajusten a tu configuración

```
sudo cp backend/scripts/autostart.template.sh /usr/bin/facturacion
# editar variables
sudo vim /usr/bin/facturacion

# correr script
facturacion
``` 

Finalmente, se puede agregar una entrada de escritorio a `$XDG_CONFIG_HOME/autostart` (`~/.config/autostart` de manera predeterminada) para que el entorno de escritorio corra el script al inicializar el sistema.

``` 
[Desktop Entry]

Type=Application
Version=1.0
Name=facturacion
Exec=facturacion
```
