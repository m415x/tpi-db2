export const aggregations = {
    profesores: {
        // Ver que materias dicta un profesor
        materiasDicta: [
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
        ],
    },
    inscripciones: {
        // Consultar qué materias cursa
        materiasCursa: [
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
        ],

        // Listar estudiantes de una materia
        estudiantesMateria: [
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
        ],

        // Ver promedio de notas parciales de cada alumno en una materia
        promediosParciales: [
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
        ]
    }
}