# Sistema de Gestión Académica - TPI DB2

Este proyecto implementa un backend en Node.js que gestiona inscripciones universitarias utilizando MongoDB como base de datos NoSQL y Mongoose como ODM.

---

## Principales Restricciones y Reglas de Negocio

Para asegurar la integridad de los datos, el sistema implementa las siguientes validaciones:

- **Baja Lógica:** Ningún registro se elimina físicamente. Se utiliza el campo `activo: Boolean`. Toda consulta de lectura está filtrada por `{ activo: true }`.
- **Integridad de Estados (Enum):** Las inscripciones solo pueden tener los estados: `["Regular", "Cursando", "Libre", "Aprobado"]`. Cualquier intento de insertar un valor distinto será rechazado por el esquema de Mongoose.
- **Unicidad:** Se ha definido un **Índice Compuesto Único** en la colección de inscripciones basado en `estudianteId` + `materiaId`. Esto impide físicamente que un estudiante pueda inscribirse dos veces a la misma materia.

---

## Cómo probar el CRUD

El script principal `index.js` realiza el siguiente flujo automáticamente:

1. **CREATE**: Limpia la DB e inserta datos semilla de prueba.
2. **READ**: Consulta los estudiantes marcados como activos.
3. **UPDATE**: Modifica datos de contacto.
4. **DELETE**: Aplica la baja lógica a un estudiante específico.

---

## Análisis RTO y RPO

> **Métricas de Recuperación ante Desastres (DRP)**
>
> - **RPO (Recovery Point Objective - Objetivo de Punto de Recuperación):** Se establece un RPO de 24 horas. Dado que el entorno académico universitario procesa información en franjas horarias centralizadas y planificadas (inscripciones, cierre de cursadas, instancias evaluativas), un respaldo físico diario mediante la ejecución automatizada de `mongodump` garantiza que, ante una caída crítica del clúster, la pérdida máxima tolerable de transacciones académicas no supere el último ciclo diario de operaciones.
> - **RTO (Recovery Time Objective - Objetivo de Tiempo de Recuperación):** Se establece un RTO de 2 horas. Al contar con copias binarias BSON compactas estructuradas de forma nativa por fecha, el proceso de restauración mediante la utilidad `mongorestore` sobre un clúster de contingencia es directo, minimizando el tiempo de inactividad y garantizando la pronta disponibilidad.

---

## Conclusión

> **Desafíos en la Comunicación Cliente-Servidor con NoSQL**
>
> Durante el desarrollo del proyecto aprendimos a conectar una aplicación Node.js con MongoDB Atlas y a realizar operaciones CRUD sobre colecciones NoSQL. Uno de los principales desafíos fue comprender el funcionamiento asincrónico de las consultas a la base de datos y gestionar correctamente las relaciones entre documentos mediante referencias ObjectId.
>
> Implementamos la baja lógica para conservar la información histórica sin eliminar documentos físicamente, respetando así los requisitos definidos.
>
> En relación con la administración de datos, la automatización de respaldos mediante `mongodump` permitió comprender la importancia de contar con mecanismos de recuperación ante fallos y de definir objetivos de recuperación como RTO y RPO.
>
> En conclusión, el trabajo permitió integrar los conceptos vistos durante la cursada, comprendiendo el flujo completo entre la aplicación cliente, el backend y el motor NoSQL, así como la importancia de la persistencia, seguridad y disponibilidad de los datos.
