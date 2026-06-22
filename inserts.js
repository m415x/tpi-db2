export const inserts = {
    estudiantes: [
        {
            matricula: "EST-001",
            nombre: "Carlos Gómez",
            activo: true,
            datosPersonales: { dni: "40123456", fechaNacimiento: Date("2001-03-15T00:00:00Z") },
            datosContacto: { email: "carlos.gomez@tup.utn.edu.ar", telefono: "1123456789" }
        },
        {
            matricula: "EST-002",
            nombre: "María Rodríguez",
            activo: true,
            datosPersonales: { dni: "41234567", fechaNacimiento: Date("2002-07-22T00:00:00Z") },
            datosContacto: { email: "maria.rod@tup.utn.edu.ar", telefono: "1134567890" }
        },
        {
            matricula: "EST-003",
            nombre: "Juan Pérez",
            activo: true,
            datosPersonales: { dni: "39456123", fechaNacimiento: Date("2000-11-05T00:00:00Z") },
            datosContacto: { email: "juan.perez@tup.utn.edu.ar" }
        },
        {
            matricula: "EST-004",
            nombre: "Ana Martínez",
            activo: true,
            datosPersonales: { dni: "42111222", fechaNacimiento: Date("2003-01-30T00:00:00Z") },
            datosContacto: { email: "ana.mtz@tup.utn.edu.ar", telefono: "1145678901" }
        },
        {
            matricula: "EST-005",
            nombre: "Lucas Silva",
            activo: true,
            datosPersonales: { dni: "40777888", fechaNacimiento: Date("2001-09-12T00:00:00Z") },
            datosContacto: { email: "lucas.silva@tup.utn.edu.ar" }
        },
        {
            matricula: "EST-006",
            nombre: "Sofía Fernandez",
            activo: true,
            datosPersonales: { dni: "41999000", fechaNacimiento: Date("2002-05-18T00:00:00Z") },
            datosContacto: { email: "sofia.f@tup.utn.edu.ar", telefono: "1156789012" }
        },
        {
            matricula: "EST-007",
            nombre: "Diego Lopez",
            activo: true,
            datosPersonales: { dni: "38555444", fechaNacimiento: Date("1999-08-25T00:00:00Z") },
            datosContacto: { email: "diego.lopez@tup.utn.edu.ar" }
        },
        {
            matricula: "EST-008",
            nombre: "Valentina Diaz",
            activo: true,
            datosPersonales: { dni: "43111000", fechaNacimiento: Date("2004-02-14T00:00:00Z") },
            datosContacto: { email: "valen.diaz@tup.utn.edu.ar", telefono: "1167890123" }
        },
        {
            matricula: "EST-009",
            nombre: "Mateo Alvarez",
            activo: true,
            datosPersonales: { dni: "40333222", fechaNacimiento: Date("2001-10-03T00:00:00Z") },
            datosContacto: { email: "mateo.alvarez@tup.utn.edu.ar" }
        },
        {
            matricula: "EST-010",
            nombre: "Camila Romero",
            activo: true,
            datosPersonales: { dni: "42555666", fechaNacimiento: Date("2003-06-29T00:00:00Z") },
            datosContacto: { email: "camila.r@tup.utn.edu.ar", telefono: "1178901234" }
        }
    ],

    profesores: [
        {
            matricula: "PROF-001",
            nombre: "Alan Turing",
            especialidad: "Ciencias de la Computación",
            activo: true,
            datosPersonales: {
                dni: "11111111",
                fechaNacimiento: Date("1980-06-23T00:00:00Z")
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
                fechaNacimiento: Date("1985-12-10T00:00:00Z")
            },
            materiasDicta: []
        }
    ]
}
