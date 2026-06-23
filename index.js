import mongoose from "mongoose";
import dns from "node:dns/promises";
import "dotenv/config";
import { models } from "./models.js";
import { inserts } from "./inserts.js";
import { aggregations } from "./aggregations.js";

// Forzar DNS de Cloudflare y Google
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Construir el string de conexión
const CLUSTER = process.env.MONGO_CLUSTER
const DB_NAME = process.env.MONGO_DB_NAME
const USER = process.env.MONGO_USER
const PASS = process.env.MONGO_PASS

const MONGO_URI = `mongodb+srv://${USER}:${PASS}@${CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

const borradoParaPruebas = false

async function inicializarBaseDeDatos() {
    // Limpieza previa para evitar duplicados de claves únicas en las pruebas
    if (borradoParaPruebas) {
        await models.InscripcionModel.deleteMany({});
        await models.MateriaModel.deleteMany({});
        await models.ProfesorModel.deleteMany({});
        await models.EstudianteModel.deleteMany({});
        console.log("-> Colecciones limpiadas con éxito.");
    }

    // 1. INSERTAR ESTUDIANTES
    const estudiantesInsertados = await models.EstudianteModel.insertMany(inserts.estudiantes);

    console.log(`\n[CREATE] ${estudiantesInsertados.length} Estudiantes insertados con éxito.`);
    console.log(estudiantesInsertados);

    // 2. INSERTAR PROFESORES
    const profesoresInsertados = await models.ProfesorModel.insertMany(inserts.profesores);

    console.log(`\n[CREATE] ${profesoresInsertados.length} Profesores insertados con éxito.`);
    console.log(profesoresInsertados);

    // Recuperamos los profesores creados para leer sus IDs generados
    const profTuring = await models.ProfesorModel.findOne({ matricula: "PROF-001" });
    const profAda = await models.ProfesorModel.findOne({ matricula: "PROF-002" });

    // 3. INSERTAR MATERIAS (Asociando los IDs de los profesores - Linking)
    const materiasInsertadas = await models.MateriaModel.insertMany([
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
    console.log(`\n[CREATE] ${materiasInsertadas.length} Materias insertadas con éxito.`);
    console.log(materiasInsertadas);

    // Recuperamos las materias creadas para leer sus IDs generados
    const materiaBD = await models.MateriaModel.findOne({ codigo: "MAT-101" });
    const materiaNoSQL = await models.MateriaModel.findOne({ codigo: "MAT-102" });

    // 4. ACTUALIZAR PROFESORES (Actualizamos el campo embebido "materiasDicta")
    await models.ProfesorModel.updateOne(
        { _id: profTuring._id },
        { $set: { materiasDicta: [{ materiaId: materiaBD._id, nombre: materiaBD.nombre }] } }
    );
    await models.ProfesorModel.updateOne(
        { _id: profAda._id },
        { $set: { materiasDicta: [{ materiaId: materiaNoSQL._id, nombre: materiaNoSQL.nombre }] } }
    );
    console.log(`\n[UPDATE]\n`, await models.ProfesorModel.find({}));

    // 5. INSERTAR INSCRIPCIONES (Extended Reference con subdocumentos)
    const alumno1 = await models.EstudianteModel.findOne({ matricula: "EST-001" });
    const alumno2 = await models.EstudianteModel.findOne({ matricula: "EST-002" });

    const inscripcionesInsertadas = await models.InscripcionModel.insertMany([
        {
            estudianteId: alumno1._id,
            materiaId: materiaBD._id,
            estado: "Cursando",
            fechaInscripcion: new Date("2026-03-10T08:00:00Z"),
            activo: true,
            estudianteInfo: { matricula: alumno1.matricula, nombre: alumno1.nombre },
            materiaInfo: { codigo: materiaBD.codigo, nombre: materiaBD.nombre },
            calificaciones: [
                { instancia: "Primer Parcial", nota: 8.5, fecha: new Date("2026-05-15T10:00:00Z") }
            ]
        },
        {
            estudianteId: alumno2._id,
            materiaId: materiaBD._id,
            estado: "Cursando",
            fechaInscripcion: new Date("2026-03-11T09:30:00Z"),
            activo: true,
            estudianteInfo: { matricula: alumno2.matricula, nombre: alumno2.nombre },
            materiaInfo: { codigo: materiaBD.codigo, nombre: materiaBD.nombre },
            calificaciones: [
                { instancia: "Primer Parcial", nota: 4.0, fecha: new Date("2026-05-15T10:00:00Z") },
                { instancia: "Segundo Parcial", nota: 7.5, fecha: new Date("2026-06-20T11:00:00Z") }
            ]
        }
    ]);
    console.log(`\n[CREATE] ${inscripcionesInsertadas.length} Inscripciones insertadas con éxito.`);
    console.log(inscripcionesInsertadas);
}

async function ejecutarReportes() {
    console.log('\nEJECUTANDO PIPELINES DE AGREGACIÓN (REPORTES)');

    // --- Reporte 1: Materias que dicta un Profesor (Colección Profesores) ---
    const reporteMateriasProf = await models.ProfesorModel.aggregate(aggregations.profesores.materiasDicta);
    console.log('\n[REPORTE] Materias que dicta el Profesor PROF-001:');
    console.dir(reporteMateriasProf, { depth: null });

    // --- Reporte 2: Materias que cursa un Alumno (Colección Inscripciones) ---
    const reporteMateriasCursa = await models.InscripcionModel.aggregate(aggregations.inscripciones.materiasCursa);
    console.log('\n[REPORTE] Materias que cursa el Estudiante EST-001:');
    console.dir(reporteMateriasCursa, { depth: null });

    // --- Reporte 3: Listar Estudiantes de una Materia (Colección Inscripciones) ---
    const reporteAlumnosMateria = await models.InscripcionModel.aggregate(aggregations.inscripciones.estudiantesMateria);
    console.log('\n[REPORTE] Estudiantes inscritos en MAT-101:');
    console.dir(reporteAlumnosMateria, { depth: null });

    // --- Reporte 4: Promedios de notas Parciales (Colección Inscripciones) ---
    const reportePromedios = await models.InscripcionModel.aggregate(aggregations.inscripciones.promediosParciales);
    console.log('\n[REPORTE] Acta de Volante con Promedios de Cursada (MAT-101):');
    console.dir(reportePromedios, { depth: null });
}

async function main() {
    // Conexión a MongoDB usando Mongoose
    await mongoose.connect(MONGO_URI);
    console.log('Conexión exitosa a MongoDB con Mongoose');

    // Ejecutamos todo nuestro árbol secuencial de inserciones
    await inicializarBaseDeDatos();

    // 5. READ: Consulta respetando estrictamente la Baja Lógica
    const estudiantesActivos = await models.EstudianteModel.find({ activo: true });
    console.log('\n[READ] Lista de estudiantes activos en el sistema:');
    console.log(estudiantesActivos.map(e => e.nombre))

    // 6. DELETE: Simulación de Baja Lógica
    const alumnoABorrar = "EST-003";
    const deleteLogicoResult = await models.EstudianteModel.updateOne(
        { matricula: alumnoABorrar },
        { $set: { activo: false } }
    );
    console.log(`\n[DELETE LÓGICO] Baja lógica aplicada a ${alumnoABorrar}. Documentos afectados: ${deleteLogicoResult.modifiedCount}`);

    // Comprobación final del READ tras la baja lógica
    const estudiantesPostBaja = await models.EstudianteModel.find({ activo: true });
    console.log('\n[READ POST-DELETE] Estudiantes remanentes tras la baja lógica:');
    console.log(estudiantesPostBaja.map(e => e.nombre))

    // Lanzamos la ejecución de los reportes complejos
    await ejecutarReportes();
    return '\nFlujo Completado con Éxito!';
}

try {
    const result = await main();
    console.log(result);
} catch (error) {
    console.error('Error en la conexión o ejecución del TPI:', error);
} finally {
    // Cierre de conexión
    await mongoose.connection.close();
    console.log('Conexión con Atlas cerrada de forma segura.');
}