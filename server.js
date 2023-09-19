const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
// import sequelize connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    define: {
        timestamps: false,
    },
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database');
        await sequelize.sync();
        console.log('All models synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
