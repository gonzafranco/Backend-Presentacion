# Backend - Organizador de tareas


Este README contiene las instrucciones para levantar el proyecto en un modo de desarrollo utilizando Node.js, Docker Compose y PM2.


## Requisitos previos


Asegúrate de tener instalados los siguientes componentes en tu sistema:


- Node.js con una version mayor o igual a 12: [Descargar e instalar Node.js](https://nodejs.org)
- Docker: [Descargar e instalar Docker](https://www.docker.com/get-started)
- Docker Compose: [Descargar e instalar Docker Compose](https://docs.docker.com/compose/install/)
- PM2: Instálalo globalmente ejecutando:  `npm install -g pm2`


## Pasos para levantar el proyecto


1. Clona el repositorio del proyecto desde GitHub con el siguiente comando.<br /> `git clone https://github.com/gonzafranco/Backend-Presentacion.git`<br />Asegurate de correr el comando en una terminal común o utilizando git bash.
2. Entrar al directorio raíz del proyecto y tirar el siguiente comando: <br />
`npm i`
<br /> Esto descarga automaticamente las dependencias necesarias para que el backend funcione correctamente.
3. Dentro de la raiz del proyecto, correr el siguiente comando para levantar la base de datos PostgreSQL y el cliente pgAdmin4 utilizando Docker Compose.
<br/> `docker-compose up` <br/>
Se puede utilizar la opcion **-d** para levantar los contenedores de forma de desantendida. El comando quedara de la siguiente forma :
<br/> `docker-compose up -d` <br/>
**Opcional** : Chequear que los contenedores esten levantados con el siguiente comando:
<br/> `docker-compose ps` <br/>


4. Levantar el backend utilizando el comando:
<br/> `pm2 start ecosystem.config.js` <br/>


5. Acceso a PosgreSql utilizando un cliente dockerizado (Pgadmin4):


- Abri tu navegador  e ingresa a `http://localhost:13001` para acceder a pgAdmin4.
- Inicia sesión con las credenciales predeterminadas (usuario: `admin@admin.com`, contraseña: `admin`).
- Registra un nuevo server con una nueva conexión a la base de datos PostgreSQL utilizando los siguientes detalles de conexión:
 - Host name/address: `postgres`
 - Port: `5432`
 - Username: `root`
 - Password: `root`

