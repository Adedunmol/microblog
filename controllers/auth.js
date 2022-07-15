const { registrationSchema, loginSchema } = require('../helpers/validation_schema')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const  _ = require('lodash')
const Role = require('../models/Role')
const { Unauthorized } = require('../errors')


const EXPIRATION_FOR_ACCESS_TOKEN = 15 * 60 * 1000
const EXPIRATION_FOR_REFRESH_TOKEN = 24 * 60 * 60 * 1000

const registrationHandler = async (req, res) => {

    const validationResult = await registrationSchema.validateAsync(req.body)

    const foundUser = await User.findOne({ where: {
        [Op.or]: {
            username: validationResult.username,
            email: validationResult.email
        }
    } })

    if (foundUser) return res.status(400).json({ msg: 'user already exists with this email or username' })

    const user = await User.create(validationResult)

    const userRole = await Role.findOne({ where: { name: 'user' } })
    const role = await user.addRole(userRole)
    
    const followSelf = await user.addUser(user)

    const result = _.omit(user.toJSON(), ['password', 'refresh_token'])

    return res.status(StatusCodes.CREATED).json({ msg: result })
}


const loginHandler = async (req, res) => {
    const cookie = req.cookies

    if (cookie?.jwt) res.clearCookie('jwt', { httpOnly: true, maxAge: EXPIRATION_FOR_REFRESH_TOKEN })

    const validationResult = await loginSchema.validateAsync(req.body)

    const foundUser = await User.findOne({ where: { email: validationResult.email } })

    if (!foundUser) return res.status(404).json({ msg: 'no user found with this mail' })

    const match = bcrypt.compare(validationResult.password, foundUser.password)

    if (match) {

        const accessToken = jwt.sign({
            UserInfo: {
                id: foundUser.id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: EXPIRATION_FOR_ACCESS_TOKEN })

        const refreshToken = jwt.sign({
            UserInfo: {
                id: foundUser.id
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: EXPIRATION_FOR_REFRESH_TOKEN })

        foundUser.refresh_token = refreshToken
        const result = await foundUser.save()
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: EXPIRATION_FOR_REFRESH_TOKEN, sameSite: 'None' })//secure: true
        return res.status(StatusCodes.OK).json({ accessToken, expiresIn: EXPIRATION_FOR_ACCESS_TOKEN })
    }
}


const logoutHandler = async (req, res) => {
    const cookie = req.cookies

    if (!cookie?.jwt) return res.sendStatus(StatusCodes.NO_CONTENT)

    const refresh_token = cookie.jwt

    const foundUser = await User.findOne({ where: { refresh_token } })

    foundUser.refresh_token = ''

    const result = foundUser.save()

    res.clearCookie('jwt', { httpOnly: true, maxAge: EXPIRATION_FOR_REFRESH_TOKEN, sameSite: 'None' })

    return res.sendStatus(StatusCodes.NO_CONTENT)
}


const refreshTokenHandler = async (req, res) => {
    const cookie = req.cookies

    if (!cookie?.jwt) throw new Unauthorized('You do not have the cookie with the jwt')

    res.clearCookie('jwt', { httpOnly: true, maxAge: EXPIRATION_FOR_REFRESH_TOKEN, sameSite: 'None' })
    const refresh_token = cookie.jwt

    const foundUser = await User.findOne({ where: { refresh_token } })

    if (!foundUser) {
        //refresh token reuse
        throw new Unauthorized('You sent a bad token')
    }

    jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, data) => {
            if (data.UserInfo.id !== foundUser.id) throw new Unauthorized('You are sending a bad token')

            if (err) throw new Unauthorized('Bad token')

            const accessToken = jwt.sign({
                UserInfo: {
                    id: foundUser.id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: EXPIRATION_FOR_ACCESS_TOKEN })
    
            const refreshToken = jwt.sign({
                UserInfo: {
                    id: foundUser.id
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: EXPIRATION_FOR_REFRESH_TOKEN })
            
            foundUser.refresh_token = refreshToken
            const result = await foundUser.save()

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: EXPIRATION_FOR_REFRESH_TOKEN, sameSite: 'None' })//secure: true

            return res.status(StatusCodes.OK).json({ accessToken, expiresIn: EXPIRATION_FOR_ACCESS_TOKEN })
        }
    )
}


module.exports = {
    registrationHandler,
    loginHandler,
    logoutHandler,
    refreshTokenHandler
}