# TPI DB2 - MongoDB Atlas, CRUD y Backups

Trabajo Práctico Integrador de **Base de Datos II (NoSQL)** desarrollado con **Node.js**, **Mongoose** y **MongoDB Atlas**.

El proyecto simula un sistema académico compuesto por estudiantes, profesores, materias e inscripciones, permitiendo demostrar operaciones CRUD, relaciones entre documentos y mecanismos de respaldo de información.

---

## Tecnologías Utilizadas

- Node.js
- MongoDB Atlas
- Mongoose
- dotenv

---

## Características Implementadas

### CRUD sobre MongoDB Atlas

- **Create:** Inserción de estudiantes, profesores, materias e inscripciones.
- **Read:** Consultas filtrando únicamente registros activos.
- **Update:** Actualización de información y relaciones entre documentos.
- **Delete (Baja Lógica):** Desactivación de registros mediante el campo `activo`.

### Modelado NoSQL

- Referencias mediante `ObjectId`.
- Documentos embebidos.
- Índices únicos.
- Relaciones entre colecciones.

### Respaldo de Datos

- Scripts para Windows y Linux/Mac.
- Creación automática de carpetas de respaldo.
- Descarga de la base de datos mediante `mongodump`.
- Organización de respaldos por fecha.

---

## Requisitos Previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js 18 o superior
- MongoDB Database Tools (`mongodump`)
- Acceso a un clúster de MongoDB Atlas

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/m415x/tpi-db2.git
cd tpi-db2
```

Instalar dependencias:

```bash
npm install
```

---

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
MONGO_USER=usuario
MONGO_PASS=password
MONGO_CLUSTER=cluster.mongodb.net
MONGO_DB_NAME=universidad
```

> Ajustar los valores según la configuración del clúster de MongoDB Atlas.

---

## Ejecución del Proyecto

Ejecutar:

```bash
node index.js
```

El script realizará:

1. Conexión a MongoDB Atlas.
2. Inserción de datos de ejemplo.
3. Consultas de lectura.
4. Actualizaciones.
5. Baja lógica.
6. Verificación de resultados.

---

## Backups

Los respaldos se almacenan dentro de:

```text
resguardos_tpi/
└── YYYY-MM-DD/
    └── dump/
```

### Linux / macOS

Dar permisos de ejecución:

```bash
chmod +x backup.sh
```

Ejecutar:

```bash
./backup.sh
```

---

### Windows CMD

Ejecutar:

```cmd
backup.bat
```

---

### Windows PowerShell

Ejecutar:

```powershell
.\backup.bat
```

---

## Restauración

Una copia generada puede restaurarse mediante:

```bash
mongorestore --uri="mongodb+srv://..." ./resguardos_tpi/AAAA-MM-DD
```

---

## Estructura del Proyecto

```text
.
├── .env
├── aggregations.js
├── index.js
├── inserts.js
├── models.js
├── backup.bat
├── backup.sh
├── package.json
└── INFORME.md
```

---

## Objetivos Académicos

Este proyecto fue desarrollado como parte del Trabajo Práctico Integrador de la asignatura Base de Datos II, con el objetivo de aplicar conceptos de:

- Bases de datos NoSQL.
- MongoDB Atlas.
- Persistencia de datos.
- Operaciones CRUD.
- Baja lógica.
- Administración y respaldo de información.
- Recuperación ante fallos (RTO/RPO).

---

## Autor

Desarrollado como trabajo académico para la materia Base de Datos II.
