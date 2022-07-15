const Agenda = require('agenda')
const { allDefinitions } = require('./definitions')

const agenda = new Agenda({
    db: {
        address: process.env.MONGO_URI,
        collections: 'microblogJobs',
        options: { useUnifiedTopology: true }
    },
    processEvery: '1 minute',
    maxConcurrency: 20
})


agenda.on('ready', async () => {
    await agenda.start()
    console.log('Agenda has started')
}).on('error', () => {
    console.log('Agenda has not started')
})

//define all agenda jobs
allDefinitions(agenda)

console.log({ jobs: agenda._definitions })


module.exports = agenda