const { JobHandlers } = require('../handlers')


const postDefinitions = (agenda) => {
    agenda.define('schedule-post', JobHandlers.schedulePost)
}

module.exports = { postDefinitions }