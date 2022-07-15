const { postDefinitions } = require('./post')

const definitions = [postDefinitions]

const allDefinitions = (agenda) => {
    definitions.forEach(definition => {
        definition(agenda)
    })
}

module.exports = { allDefinitions }