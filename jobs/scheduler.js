const agenda = require('./index')


const schedule = {
    schedulePost: async (data, date) => {

        const postDate = new Date(date)

        console.log('scheduling job')
        await agenda.schedule(postDate, 'schedule-post', data)
    }
}

module.exports = { schedule }