const axios = require('axios');
const Provider = require('../models/provider');

async function updateProvider(_, { id, input }) {
    const provider = await Provider.findByPk(id);
    if (!provider) throw new Error(`Provider with ID ${id} not found`);

    await provider.update(input);
    console.log(`Proveedor con ID ${id} actualizado en la base local`);

    // Notificar a los otros microservicios
    const instances = [
        'http://localhost:5000/sync-update', // Microservicio de Crear
        'http://localhost:5001/sync-update', // Microservicio de Eliminar
    ];

    for (const instance of instances) {
        try {
            await axios.post(instance, { id, ...input });
            console.log(`Notificación enviada a ${instance} para actualizar el proveedor con ID ${id}`);
        } catch (error) {
            console.error(`Error notificando a ${instance}:`, error.message);
        }
    }

    return provider;
}

module.exports = { updateProvider };
