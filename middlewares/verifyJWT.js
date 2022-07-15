const jwt = require('jsonwebtoken')


const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'You do not have a token or the token is badly formed' })

    const accessToken = authHeader.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, data) => {
            if (err) return res.status(403).json({ msg: 'You are sending a bad token' })
            
            req.user = {
                id: data.UserInfo.id
            }
            next()
        }
    )
}

module.exports = verifyJWT