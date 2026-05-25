// use gestionAcademica;

// ============================================================================
// CREACIÓN DE COLECCIONES CON VALIDACIONES E ÍNDICES
// ============================================================================

// COLECCIÓN ESTUDIANTES
db.createCollection("estudiantes", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["matricula", "nombre", "datosPersonales", "activo"],
            properties: {
                matricula: {
                    bsonType: "string",
                    description: "Matrícula única"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre completo"
                },
                activo: {
                    bsonType: "bool",
                    description: "Para manejo de baja lógica"
                },
                datosPersonales: {
                    bsonType: "object",
                    description: "Datos personales",
                    required: ["dni"],
                    properties: {
                        dni: { bsonType: "string" },
                        fechaNacimiento: { bsonType: "date" }
                    }
                },
                datosContacto: {
                    bsonType: "object",
                    description: "Datos de contacto",
                    properties: {
                        direccion: { bsonType: "string" },
                        telefono: { bsonType: "string" },
                        email: { bsonType: "string" }
                    }
                }
            }
        }
    }
});
db.estudiantes.createIndex({ matricula: 1 }, { unique: true });

// COLECCIÓN PROFESORES
db.createCollection("profesores", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["matricula", "nombre", "especialidad", "activo"],
            properties: {
                matricula: {
                    bsonType: "string",
                    description: "Matrícula del profesor"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre completo"
                },
                especialidad: {
                    bsonType: "string",
                    description: "Especialidad del profesor"
                },
                activo: {
                    bsonType: "bool",
                    description: "Para manejo de baja lógica"
                },
                datosPersonales: {
                    bsonType: "object",
                    description: "Datos personales del profesor",
                    properties: {
                        dni: { bsonType: "string" },
                        fechaNacimiento: { bsonType: "date" }
                    }
                },
                materiasDicta: {
                    bsonType: "array",
                    description: "Materias dictadas por el profesor",
                    items: {
                        bsonType: "object",
                        properties: {
                            materiaId: { bsonType: "string" },
                            nombre: { bsonType: "string" }
                        }
                    }
                }
            }
        }
    }
});
db.profesores.createIndex({ matricula: 1 }, { unique: true });

// COLECCIÓN MATERIAS
db.createCollection("materias", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["codigo", "nombre", "activo"],
            properties: {
                codigo: {
                    bsonType: "string",
                    description: "Código de la materia"
                },
                nombre: {
                    bsonType: "string",
                    description: "Nombre de la materia"
                },
                activo: {
                    bsonType: "bool",
                    description: "Para manejo de baja lógica"
                },
                // Linking: Referencia al ID del profesor que la dicta
                profesorId: {
                    bsonType: "objectId",
                    description: "ID de referencia de la colección profesores"
                }
            }
        }
    }
});
db.materias.createIndex({ codigo: 1 }, { unique: true });

// COLECCIÓN INSCRIPCIONES
db.createCollection("inscripciones", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["estudianteId", "materiaId", "estado", "activo"],
            properties: {
                // Linking obligatorios para integridad
                estudianteId: {
                    bsonType: "objectId",
                    description: "ID de referencia de la colección estudiantes"
                },
                materiaId: {
                    bsonType: "objectId",
                    description: "ID de referencia de la colección materias"
                },
                estado: {
                    bsonType: "string",
                    enum: ["Regular", "Cursando", "Libre", "Aprobado"],
                    description: "Estado de la inscripción"
                },
                fechaInscripcion: { bsonType: "date" },
                activo: {
                    bsonType: "bool",
                    description: "Para manejo de baja lógica"
                },
                // Redundancia controlada (Extended Reference Pattern) para evitar LOOKUPS costosos
                estudianteInfo: {
                    bsonType: "object",
                    required: ["matricula", "nombre"],
                    properties: {
                        matricula: { bsonType: "string" },
                        nombre: { bsonType: "string" }
                    }
                },
                materiaInfo: {
                    bsonType: "object",
                    required: ["codigo", "nombre"],
                    properties: {
                        codigo: { bsonType: "string" },
                        nombre: { bsonType: "string" }
                    }
                },
                // Calificaciones como array de objetos embebidos
                calificaciones: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["instancia", "nota"],
                        properties: {
                            instancia: { bsonType: "string", description: "Parcial 1, Parcial 2, Final, etc." },
                            nota: { bsonType: "number" },
                            fecha: { bsonType: "date" }
                        }
                    }
                }
            }
        }
    }
});
// Índice compuesto único: evita que un alumno se inscriba dos veces a la misma materia activa
db.inscripciones.createIndex({ estudianteId: 1, materiaId: 1 }, { unique: true, name: "idx_estudiante_materia_unique" });

// ============================================================================
// 1. INSERCIÓN DE PROFESORES
// ============================================================================
db.profesores.insertMany([
    {
        matricula: "PROF-001",
        nombre: "Alan Turing",
        especialidad: "Ciencias de la Computación",
        activo: true,
        datosPersonales: {
            dni: "11111111",
            fechaNacimiento: ISODate("1980-06-23T00:00:00Z")
        },
        materiasDicta: []
    },
    {
        matricula: "PROF-002",
        nombre: "Ada Lovelace",
        especialidad: "Sistemas y Programación",
        activo: true,
        datosPersonales: {
            dni: "22222222",
            fechaNacimiento: ISODate("1985-12-10T00:00:00Z")
        },
        materiasDicta: []
    }
]);

// Recuperamos los IDs de los profesores generados dinámicamente para usarlos como referencia
const profTuring = db.profesores.findOne({ matricula: "PROF-001" });
const profAda = db.profesores.findOne({ matricula: "PROF-002" });

// ============================================================================
// 2. INSERCIÓN DE MATERIAS (Asociando los profesores mediante linking)
// ============================================================================
db.materias.insertMany([
    {
        codigo: "MAT-101",
        nombre: "Introducción a las Bases de Datos",
        activo: true,
        profesorId: profTuring._id
    },
    {
        codigo: "MAT-102",
        nombre: "Programación Avanzada NoSQL",
        activo: true,
        profesorId: profAda._id
    }
]);

// Recuperamos los IDs y datos de las materias creadas
const materiaBD = db.materias.findOne({ codigo: "MAT-101" });
const materiaNoSQL = db.materias.findOne({ codigo: "MAT-102" });

// Actualizamos el campo embebido "materiasDicta" en profesores
db.profesores.updateOne(
    { _id: profTuring._id },
    { $set: { materiasDicta: [{ materiaId: materiaBD._id.toString(), nombre: materiaBD.nombre }] } }
);
db.profesores.updateOne(
    { _id: profAda._id },
    { $set: { materiasDicta: [{ materiaId: materiaNoSQL._id.toString(), nombre: materiaNoSQL.nombre }] } }
);


// ============================================================================
// 3. INSERCIÓN DE 10 ESTUDIANTES
// ============================================================================
db.estudiantes.insertMany([
    {
        matricula: "EST-001",
        nombre: "Carlos Gómez",
        activo: true,
        datosPersonales: { dni: "40123456", fechaNacimiento: ISODate("2001-03-15T00:00:00Z") },
        datosContacto: { email: "carlos.gomez@tup.utn.edu.ar", telefono: "1123456789" }
    },
    {
        matricula: "EST-002",
        nombre: "María Rodríguez",
        activo: true,
        datosPersonales: { dni: "41234567", fechaNacimiento: ISODate("2002-07-22T00:00:00Z") },
        datosContacto: { email: "maria.rod@tup.utn.edu.ar", telefono: "1134567890" }
    },
    {
        matricula: "EST-003",
        nombre: "Juan Pérez",
        activo: true,
        datosPersonales: { dni: "39456123", fechaNacimiento: ISODate("2000-11-05T00:00:00Z") },
        datosContacto: { email: "juan.perez@tup.utn.edu.ar" }
    },
    {
        matricula: "EST-004",
        nombre: "Ana Martínez",
        activo: true,
        datosPersonales: { dni: "42111222", fechaNacimiento: ISODate("2003-01-30T00:00:00Z") },
        datosContacto: { email: "ana.mtz@tup.utn.edu.ar", telefono: "1145678901" }
    },
    {
        matricula: "EST-005",
        nombre: "Lucas Silva",
        activo: true,
        datosPersonales: { dni: "40777888", fechaNacimiento: ISODate("2001-09-12T00:00:00Z") },
        datosContacto: { email: "lucas.silva@tup.utn.edu.ar" }
    },
    {
        matricula: "EST-006",
        nombre: "Sofía Fernandez",
        activo: true,
        datosPersonales: { dni: "41999000", fechaNacimiento: ISODate("2002-05-18T00:00:00Z") },
        datosContacto: { email: "sofia.f@tup.utn.edu.ar", telefono: "1156789012" }
    },
    {
        matricula: "EST-007",
        nombre: "Diego Lopez",
        activo: true,
        datosPersonales: { dni: "38555444", fechaNacimiento: ISODate("1999-08-25T00:00:00Z") },
        datosContacto: { email: "diego.lopez@tup.utn.edu.ar" }
    },
    {
        matricula: "EST-008",
        nombre: "Valentina Diaz",
        activo: true,
        datosPersonales: { dni: "43111000", fechaNacimiento: ISODate("2004-02-14T00:00:00Z") },
        datosContacto: { email: "valen.diaz@tup.utn.edu.ar", telefono: "1167890123" }
    },
    {
        matricula: "EST-009",
        nombre: "Mateo Alvarez",
        activo: true,
        datosPersonales: { dni: "40333222", fechaNacimiento: ISODate("2001-10-03T00:00:00Z") },
        datosContacto: { email: "mateo.alvarez@tup.utn.edu.ar" }
    },
    {
        matricula: "EST-010",
        nombre: "Camila Romero",
        activo: true,
        datosPersonales: { dni: "42555666", fechaNacimiento: ISODate("2003-06-29T00:00:00Z") },
        datosContacto: { email: "camila.r@tup.utn.edu.ar", telefono: "1178901234" }
    }
]);


// ============================================================================
// 4. EJEMPLO DE INSCRIPCIÓN (Para verificar la colección intermedia)
// ============================================================================
// Vamos a inscribir a los 2 primeros alumnos en la materia de "Bases de Datos"
const alumno1 = db.estudiantes.findOne({ matricula: "EST-001" });
const alumno2 = db.estudiantes.findOne({ matricula: "EST-002" });

db.inscripciones.insertMany([
    {
        estudianteId: alumno1._id,
        materiaId: materiaBD._id,
        estado: "Cursando",
        fechaInscripcion: ISODate("2026-03-10T08:00:00Z"),
        activo: true,
        estudianteInfo: {
            matricula: alumno1.matricula,
            nombre: alumno1.nombre
        },
        materiaInfo: {
            codigo: materiaBD.codigo,
            nombre: materiaBD.nombre
        },
        calificaciones: [
            { instancia: "Primer Parcial", nota: 8.5, fecha: ISODate("2026-05-15T10:00:00Z") }
        ]
    },
    {
        estudianteId: alumno2._id,
        materiaId: materiaBD._id,
        estado: "Cursando",
        fechaInscripcion: ISODate("2026-03-11T09:30:00Z"),
        activo: true,
        estudianteInfo: {
            matricula: alumno2.matricula,
            nombre: alumno2.nombre
        },
        materiaInfo: {
            codigo: materiaBD.codigo,
            nombre: materiaBD.nombre
        },
        calificaciones: [
            { instancia: "Primer Parcial", nota: 4.0, fecha: ISODate("2026-05-15T10:00:00Z") },
            { instancia: "Segundo Parcial", nota: 7.5, fecha: ISODate("2026-06-20T11:00:00Z") }
        ]
    }
]);

// ============================================================================
// CONSULTAS CON AGGREGATION
// ============================================================================

// Consultar qué materias cursa
db.inscripciones.aggregate([
    {
        // Filtramos solo las inscripciones activas de un alumno específico
        $match: {
            "estudianteInfo.matricula": "EST-001",
            activo: true
        }
    },
    {
        // Limpiamos la salida para mostrar solo lo que le interesa al usuario
        $project: {
            _id: 0,
            codigoMateria: "$materiaInfo.codigo",
            nombreMateria: "$materiaInfo.nombre",
            estadoAcademico: "$estado",
            fechaDeInscripcion: "$fechaInscripcion"
        }
    }
]);

// Listar estudiantes de una materia
db.inscripciones.aggregate([
    {
        // Filtramos por la materia en cuestión y que la inscripción no sea una baja lógica
        $match: {
            "materiaInfo.codigo": "MAT-101",
            activo: true
        }
    },
    {
        // Armamos un reporte estructurado de los alumnos inscritos
        $project: {
            _id: 0,
            matriculaAlumno: "$estudianteInfo.matricula",
            nombreAlumno: "$estudianteInfo.nombre",
            estadoCursada: "$estado",
            // Si tiene calificaciones las muestra, sino devuelve un array vacío
            calificaciones: { $ifNull: ["$calificaciones", []] }
        }
    }
]);

// Ver que materias dicta un profesor
db.profesores.aggregate([
    {
        // Buscamos al profesor por su matrícula
        $match: {
            matricula: "PROF-001",
            activo: true
        }
    },
    {
        // "$unwind" rompe el array "materiasDicta" y genera un documento por cada materia
        $unwind: "$materiasDicta"
    },
    {
        // Modelamos la salida final del reporte
        $project: {
            _id: 0,
            profesor: "$nombre",
            nombreMateria: "$materiasDicta.nombre"
        }
    }
]);

// Ver promedio de notas parciales de cada alumno en una materia
db.inscripciones.aggregate([
    {
        // Filtramos las inscripciones activas de la materia
        $match: {
            "materiaInfo.codigo": "MAT-101",
            activo: true
        }
    },
    {
        // Proyectamos y filtramos el array de calificaciones al vuelo
        $project: {
            _id: 0,
            materia: "$materiaInfo.nombre",
            estudiante: "$estudianteInfo.nombre",
            estado: "$estado",

            // Creamos un campo temporal que solo contenga los objetos "Parcial"
            soloParciales: {
                $filter: {
                    input: "$calificaciones",
                    as: "calificacion",
                    cond: {
                        // Evaluamos si el texto de 'instancia' contiene la palabra "Parcial"
                        $regexMatch: {
                            input: "$$calificacion.instancia",
                            regex: /Parcial/i  // La 'i' hace que sea insensible a mayúsculas/minúsculas
                        }
                    }
                }
            }
        }
    },
    {
        // Calculamos el promedio basándonos únicamente en el array filtrado
        $project: {
            materia: 1,
            estudiante: 1,
            estado: 1,
            promedioParciales: {
                $ifNull: [{ $avg: "$soloParciales.nota" }, 0] // Si no tiene parciales, devuelve 0
            }
        }
    },
    {
        // Ordenamos los resultados por promedio descendente
        $sort: { promedioParciales: -1 }
    }
]);