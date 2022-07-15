const { StatusCodes } = require("http-status-codes")


const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong'
    }

    return res.status(customError.statusCode).json({ message: customError.message })
}

module.exports = errorHandler