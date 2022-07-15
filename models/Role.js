const sequelize = require('../config/dbConn')
const { DataTypes } = require('sequelize')


const Role = sequelize.define('role', {
    name: {
        type: DataTypes.STRING,
        default: 'user'
    }
}, {
    timestamps: false
})

module.exports = Role