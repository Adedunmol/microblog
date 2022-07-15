const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbConn')


const Comment = sequelize.define('comment', {
    body: {
        type: DataTypes.TEXT
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Comment