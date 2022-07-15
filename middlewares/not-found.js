
const notFound = async (req, res) => {
    res.status(404).send(`No route found: ${req.url}`)
}


module.exports = notFound