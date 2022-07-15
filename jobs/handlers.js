const User = require('../models/User')


const JobHandlers = {
    schedulePost: async (job) => {

        const { userId, title, body } = job.attrs.data

        const postBody = { title, body }

        const user = await User.findByPk(userId)

        const post = await user.createPost(postBody)
    }
}

module.exports = { JobHandlers }