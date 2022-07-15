const { StatusCodes } = require('http-status-codes')
const { Post, User, Comment } = require('../models/')
const { Op } = require('sequelize')
const  _ = require('lodash')
const Sequelize = require('sequelize')
const { Unauthorized, BadRequest, NotFound, Forbidden } = require('../errors')
const { postSchema, updatePostSchema, commentSchema, scheduledPostSchema } = require('../helpers/validation_schema')
const postSchedulerEvent = require('../events/schedulePost')
const sequelize = require('sequelize')


const getAllPosts = async (req, res) => {
    const { page, limit, sort } = req.query

    const queryObj = {}

    queryObj.limit = limit ? limit : 10    

    queryObj.order = sort ? [[sort, 'ASC']] : [['createdAt', 'ASC']]

    queryObj.offset = page ? (page - 1) * limit : 0

    const posts = await Post.findAll(queryObj)

    return res.status(StatusCodes.OK).json({ data: posts, nbHits: posts.length })
}


const getPost = async (req, res) => {
    const { postId } = req.params

    if (!postId) throw new BadRequest('There is no post id')

    const post = await Post.findOne({ where: { id: postId }, attributes: [
        'id',
        'title',
        'body',
        [Sequelize.literal('(SELECT COUNT(*) FROM likes where likes."postId"=Post.id)'), 'LikeCount']],
        include: {
            model: User,
            as: 'Likers',
            attributes: {
                exclude: ['password', 'refresh_token', 'email']
            },
            through: {
                attributes: []
            }
        } 
})

    if (!post) throw new NotFound('No post with this id')

    return res.status(StatusCodes.OK).json({ data: post })
}


const createPost = async (req, res) => {

    const { id } = req.user

    const validationResult = await postSchema.validateAsync(req.body)

    const user = await User.findByPk(id)

    const post = await user.createPost(validationResult)

    return res.status(StatusCodes.OK).json({ data: post })
}


const updatePost = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const validationResult = await updatePostSchema.validateAsync(req.body)

    const post = await Post.findByPk(postId)
    
    if (post.userId !== userId) throw new Forbidden('You are not the owner of this post')

    post.title = validationResult.title || post.title
    post.body = validationResult.body || post.body

    const result = await post.save()

    return res.status(StatusCodes.OK).json({ data: result })

}


const deletePost = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const post = await Post.findByPk(postId)
    
    if (post.userId !== userId) throw new Forbidden('You are not the owner of this post')

    const result = await post.destroy()

    return res.status(StatusCodes.OK).json({ msg: 'Post has been deleted' })
}


const createPostComment = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const validationResult = await commentSchema.validateAsync(req.body)

    const post = await Post.findByPk(postId)

    const comment = await post.createComment({
        ...validationResult,
        userId
    })

    const result = _.omit(comment.toJSON(), ['disabled'])

    return res.status(StatusCodes.CREATED).json({ data: result })
}


const getPostComments = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const post = await Post.findByPk(postId)

    const comments = await post.getComments()

    return res.status(StatusCodes.OK).json({ data: comments })
}


const likePost = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const user = await User.findByPk(userId)
    const post = await Post.findByPk(postId)

    const like = await user.addLiked(post)

    return res.status(StatusCodes.OK).json({ msg: `User ${user.id} has liked post ${post.id}` })
}


const unlikePost = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const user = await User.findByPk(userId)
    const post = await Post.findByPk(postId)

    const like = await user.removeLiked(post)

    return res.status(StatusCodes.OK).json({ msg: `User ${user.id} has unliked post ${post.id}` })
}


const savePost = async (req, res) => {
    const { postId } = req.params
    const { id: userId } = req.user

    if (!postId) throw new BadRequest('There is no post id')

    const user = await User.findByPk(userId)
    const post = await Post.findByPk(postId)

    const savedPost = await user.addSaved(post)

    return res.status(StatusCodes.OK).json({ msg: `User ${user.id} has saved post ${post.id}` })
}


const schedulePost = async (req, res) => {
    const { id } = req.user

    const validationResult = await scheduledPostSchema.validateAsync(req.body)

    const user = await User.findByPk(id)

    const scheduledPostObj = {
        ...validationResult,
        userId: user.id
    }

    postSchedulerEvent.emit('schedule-post', scheduledPostObj)

    return res.status(StatusCodes.CREATED).json({ data: scheduledPostObj })
}


module.exports = {
    getPost,
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    createPostComment,
    getPostComments,
    likePost,
    unlikePost,
    savePost,
    schedulePost
}