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
                    'http://34.198.77.62:5000/sync-update', // Microservicio de Crear
                    'http://23.21.70.193:5001/sync-update',  // Microservicio de Eliminar
                    'http://3.229.198.244:5003/sync-update'  // ✅ Microservicio de Leer
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
