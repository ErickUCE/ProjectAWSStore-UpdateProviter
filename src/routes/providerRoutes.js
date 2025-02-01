const express = require('express');
const bodyParser = require('body-parser');
const Provider = require('../models/provider');

const router = express.Router();
router.use(bodyParser.json()); // ✅ Se aplica bodyParser solo una vez

// ✅ Endpoint para sincronizar creación de proveedores desde el microservicio de Crear
router.post('/sync-create', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-create:', req.body);
    const { id, name, address, email } = req.body;

    try {
        // Verifica si el proveedor ya existe en Update
        const existingProvider = await Provider.findByPk(id);
        if (!existingProvider) {
            await Provider.create({ id, name, address, email });
            console.log(`✅ Proveedor con ID ${id} sincronizado en Update`);
        } else {
            console.log(`⚠️ Proveedor con ID ${id} ya existe en Update`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} sincronizado correctamente en Update` });
    } catch (error) {
        console.error('❌ Error sincronizando creación de proveedor en Update:', error);
        res.status(500).send({ error: 'Failed to sync provider creation' });
    }
});

// ✅ Endpoint para sincronizar actualización de proveedores desde el microservicio de Update
router.post('/sync-update', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-update:', req.body);
    const { id, name, address, email } = req.body;

    try {
        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.update({ name, address, email });
            console.log(`✅ Proveedor con ID ${id} actualizado en la base de Update`);
        } else {
            console.log(`⚠️ Proveedor con ID ${id} no encontrado en Update`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} actualizado correctamente en Update` });
    } catch (error) {
        console.error('❌ Error sincronizando actualización de proveedor en Update:', error);
        res.status(500).send({ error: 'Failed to sync provider update' });
    }
});

// ✅ Endpoint para sincronizar eliminación de proveedores desde el microservicio de Eliminar
router.post('/sync-delete', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-delete:', req.body);
    const { id } = req.body;

    try {
        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.destroy();
            console.log(`✅ Proveedor con ID ${id} eliminado en la base de Editar`);
        } else {
            console.log(`⚠️ Proveedor con ID ${id} no encontrado en la base de Editar`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} eliminado correctamente en Editar` });
    } catch (error) {
        console.error('❌ Error sincronizando eliminación de proveedor en Editar:', error);
        res.status(500).send({ error: 'Failed to sync provider delete' });
    }
});

module.exports = router;
