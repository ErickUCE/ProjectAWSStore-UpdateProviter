const express = require('express');
const Provider = require('../models/provider');

const router = express.Router();

router.post('/sync-update', async (req, res) => {
    const { id, name, address, email } = req.body;

    try {
        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.update({ name, address, email });
            console.log(`Proveedor con ID ${id} sincronizado en la base local`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} actualizado correctamente` });
    } catch (error) {
        res.status(500).send({ error: 'Failed to sync provider update' });
    }
});

module.exports = router;
