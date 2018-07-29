const Sequlize = require('sequelize');
const sequlize = require('../sequelize');

let Message = sequlize.define('message', {
    id: {
        type: Sequlize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email: Sequlize.STRING(100),
    content: Sequlize.STRING(5000),
    varificationCode: Sequlize.STRING(1000),
    beenReaded: Sequlize.BOOLEAN
}, {
        freezeTableName: true,
        timestamps: true,
    });

module.exports = Message;
