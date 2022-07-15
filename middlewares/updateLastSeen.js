const { User } = require("../models")


const updateLastSeen = async (req, res, next) => {

    const { id } = req.user

    const user = await User.findByPk(id)

    user.last_seen = new Date()

    const result = await user.save()
    next()
}

module.exports = updateLastSeen