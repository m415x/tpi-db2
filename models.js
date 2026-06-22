import mongoose from 'mongoose';

export const models = {
    EstudianteModel: mongoose.model("estudiantes", new mongoose.Schema({
        matricula: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        nombre: {
            type: String,
            required: true
        },
        activo: {
            type: Boolean,
            required: true,
            default: true
        },
        datosPersonales: {
            dni: {
                type: String,
                required: true
            },
            fechaNacimiento: { type: Date }
        },
        datosContacto: {
            direccion: { type: String },
            telefono: { type: String },
            email: { type: String }
        }
    }, {
        timestamps: true
    })),

    ProfesorModel: mongoose.model("profesores", new mongoose.Schema({
        matricula: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        nombre: {
            type: String,
            required: true,
        },
        especialidad: {
            type: String,
            required: true,
        },
        activo: {
            type: Boolean,
            required: true,
            default: true
        },
        datosPersonales: {
            dni: { type: String },
            fechaNacimiento: { type: Date }
        },
        materiasDicta: [{
            materiaId: { type: mongoose.Schema.Types.ObjectId },
            nombre: { type: String }
        }]
    }, {
        timestamps: true
    })),

    MateriaModel: mongoose.model("materias", new mongoose.Schema({
        codigo: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        nombre: {
            type: String,
            required: true,
        },
        activo: {
            type: Boolean,
            required: true,
            default: true
        },
        // Linking: Referencia al ID del profesor que la dicta
        profesorId: { type: mongoose.Schema.Types.ObjectId },
    }, {
        timestamps: true
    })),

    InscripcionModel: mongoose.model("inscripciones", new mongoose.Schema({
        // Linking obligatorios para integridad
        estudianteId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        materiaId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        estado: {
            type: String,
            required: true,
            enum: ["Regular", "Cursando", "Libre", "Aprobado"]
        },
        fechaInscripcion: { type: Date },
        activo: {
            type: Boolean,
            required: true,
            default: true
        },
        // Redundancia controlada (Extended Reference Pattern) para evitar LOOKUPS costosos
        estudianteInfo: {
            matricula: { type: String, required: true },
            nombre: { type: String, required: true }
        },
        materiaInfo: {
            codigo: { type: String, required: true },
            nombre: { type: String, required: true }
        },
        // Calificaciones como array de objetos embebidos
        calificaciones: [{
            instancia: { type: String, required: true },
            nota: { type: Number, required: true },
            fecha: { type: Date }
        }]
    }, {
        timestamps: true
    }).index({ estudianteId: 1, materiaId: 1 }, { unique: true, name: "idx_estudiante_materia_unique" }))
}
