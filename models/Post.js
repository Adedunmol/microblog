const { DataTypes } = require('sequelize')
const sequelize = require('../config/dbConn')


const Post = sequelize.define('post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Post