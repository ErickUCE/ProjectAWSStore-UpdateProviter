const axios = require('axios');
const Provider = require('../models/provider');

const resolvers = {
    Mutation: {
        updateProvider: async (_, { id, input }) => {
            try {
                // Buscar el proveedor en la base de datos local
                const provider = await Provider.findByPk(id);
                if (!provider) throw new Error(`Provider with ID ${id} not found`);

                // Actualizar el proveedor en la base de datos local
                await provider.update(input);
                console.log(`Proveedor con ID ${id} actualizado en la base de Update`);

                // Notificar a los otros microservicios
                const instances = [
                    'http://localhost:5000/sync-update', // Microservicio de Crear
                    'http://localhost:5001/sync-update'  // Microservicio de Eliminar
                ];

                for (const instance of instances) {
                    try {
                        await axios.post(instance, { id, ...input });
                        console.log(`Notificación enviada a ${instance} para sincronizar actualización`);
                    } catch (error) {
                        console.error(`Error notificando a ${instance}:`, error.message);
                    }
                }

                return provider;
            } catch (error) {
                console.error('Error actualizando proveedor:', error);
                throw new Error('Failed to update provider');
            }
        },
    },
};

module.exports = resolvers;
