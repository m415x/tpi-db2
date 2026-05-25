const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Forzar DNS de Cloudflare y Google

// Conexión a MongoDB
const mongoose = require('mongoose');

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}`;

mongoose.connect(MONGO_URI)
    .then(() => console.log('¡Conectado a MongoDB Atlas!'))
    .catch(err => console.error('Error al conectar:', err));
