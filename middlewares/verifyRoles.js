const { User } = require("../models")
const { Forbidden } = require('../errors')

const verifyRoles = (...roles) => {
    return async (req, res, next) => {
        const neededRoles = [...roles]
        
        const user = await User.findByPk(req.user.id)
        const userRoles = await user.getRoles({ raw: true })
        
        const result = userRoles.map(role => neededRoles.includes(role.name)).filter(val => val == true)
        
        if(result.length < 1 || !result) throw new Forbidden('You are not authorized to access this route')

        next()
    }
}

module.exports = verifyRoles