const { Sequelize } = require('sequelize');
require('dotenv').config(); //Carga las varibales del archivo .env -- Load the variables from the file .env

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_UPDATE,
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
