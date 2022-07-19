const sequelize = require('../config/dbConn')
const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')


const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            len: [4]
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        },
        set(value) {
            const lower_email = value.toLowerCase()
            this.setDataValue('email', lower_email)
        }
    },
    password: {
        type: DataTypes.STRING,
        
        set(value) {
            const password_hash = bcrypt.hashSync(value, 10)
            this.setDataValue('password', password_hash)
        }
    },
    private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    last_seen: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
    },
})



module.exports = User