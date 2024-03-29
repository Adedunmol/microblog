const { registrationSchema, loginSchema, updateUserSchema } = require('../helpers/validation_schema')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { Unauthorized, BadRequest, NotFound } = require('../errors')
const  _ = require('lodash')


const getUser = async (req, res) => {
    const { userId } = req.params

    if (!userId) throw new BadRequest('There is no post id')

    const user = await User.findOne({ where: { id: userId }, attributes: { exclude: ['password', 'refresh_token'] } })

    if (!user) throw new NotFound('No user found with this id')

    return res.status(StatusCodes.OK).json({ data: user })
}


const updateUser = async (req, res) => {
    const { userId } = req.params

    const validationResult = await updateUserSchema.validateAsync(req.body)

    if (!userId) throw new BadRequest('There is no post id')

    const user = await User.findByPk(userId)

    if (!user) throw new NotFound('No user found with this id')

    const result = await user.update(validationResult)

    const updatedUser = _.omit(result.toJSON(), ['password', 'refresh_token'])

    return res.status(StatusCodes.OK).json({ data: updatedUser })
}


const getFollowers = async (req, res) => {
    const { userId } = req.params

    if (!userId) throw new BadRequest('No id sent with with url')

    const user = await User.findByPk(userId)

    if (!user) throw new NotFound('No user found with this id')

    const followers = await user.getFollowed({attributes: { exclude: ['password', 'refresh_token'] }})

    return res.status(StatusCodes.OK).json({ data: followers })
}


const followUser = async (req, res) => {
    const { id } = req.user
    const { userId } = req.params

    if (!userId) throw new BadRequest('No id sent with url')

    const user = await User.findByPk(id)
    const followedUser = await User.findByPk(userId)

    if (!followedUser) throw new NotFound('No user found with this id')

    const followers = await user.addUser(followedUser)

    return res.status(StatusCodes.OK).json({ msg: `You are now following ${userId}` })
}


const getFollowing = async (req, res) => {
    const { userId } = req.params

    if (!userId) throw new BadRequest('No id sent with url')

    const user = await User.findByPk(userId)

    if (!user) throw new NotFound('No user found with this id')

    const followers = await user.getUser({attributes: { exclude: ['password', 'refresh_token'] }})

    return res.status(StatusCodes.OK).json({ data: followers })
}


const unfollowUser = async (req, res) => {
    const { id } = req.user
    const { userId } = req.params

    if (!userId) throw new BadRequest('No id sent with url')

    const user = await User.findByPk(id)
    const followedUser = await User.findByPk(userId)

    if (!followedUser) throw new NotFound('No user found with this id')

    const followers = await user.removeUser(followedUser)

    return res.status(StatusCodes.OK).json({ msg: `You are no longer following ${userId}` })
}


const getUserPosts = async (req, res) => {
    const { userId } = req.params

    if (!userId) throw new BadRequest('No userId with request')

    const user = await User.findByPk(userId)

    if (!user) throw new NotFound('No user found with this id')

    const posts = await user.getPosts()

    return res.status(StatusCodes.OK).json({ data: posts })
}


module.exports = {
    getUser,
    updateUser,
    getFollowers,
    followUser,
    getFollowing,
    unfollowUser,
    getUserPosts
}