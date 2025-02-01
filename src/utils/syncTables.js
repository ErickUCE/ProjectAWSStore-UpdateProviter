const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Verificar que se están usando las IPs correctas
console.log("Conectando a Crear en:", process.env.DB_HOST_CREATE);
console.log("Conectando a Update en:", process.env.DB_HOST_UPDATE);

// Conexión a la base de datos del microservicio de Crear
const createDB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_CREATE, // ⚠️ Revisar si es la IP correcta
    dialect: 'mysql',
    logging: false,
});

// Conexión a la base de datos del microservicio de Update
const updateDB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_UPDATE, // ⚠️ Revisar si es la IP correcta
    dialect: 'mysql',
    logging: false,
});

// Modelo de Provider
const ProviderModel = (sequelize) =>
    sequelize.define('Provider', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
    }, { freezeTableName: true });

// Instancias del modelo en cada base de datos
const ProviderInCreate = ProviderModel(createDB);
const ProviderInUpdate = ProviderModel(updateDB);

// Función de sincronización
async function syncTables() {
    try {
        await createDB.authenticate();
        await updateDB.authenticate();
        console.log('✅ Conexión exitosa a ambas bases de datos');

        const providersInCreate = await ProviderInCreate.findAll();
        console.log(`🔄 Se encontraron ${providersInCreate.length} proveedores en Crear`);

        for (const provider of providersInCreate) {
            const existingProvider = await ProviderInUpdate.findByPk(provider.id);
            if (!existingProvider) {
                await ProviderInUpdate.create(provider.toJSON());
                console.log(`✅ Proveedor con ID ${provider.id} sincronizado en Update`);
            } else {
                console.log(`⚠️ Proveedor con ID ${provider.id} ya existe en Update`);
            }
        }

        console.log('✅ Sincronización completada');
    } catch (error) {
        console.error('❌ Error sincronizando las tablas:', error);
    } finally {
        await createDB.close();
        await updateDB.close();
    }
}

syncTables();
