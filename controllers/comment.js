const { updateCommentSchema } = require('../helpers/validation_schema')
const { StatusCodes } = require('http-status-codes')
const { Unauthorized, BadRequest, NotFound } = require('../errors')
const  _ = require('lodash')
const { Comment } = require('../models')


const getAllComments = async (req, res) => {

    const comments = await Comment.findAll()

    return res.status(StatusCodes.OK).json({ data: comments })
}


const getComment = async (req, res) => {
    const { commentId } = req.params

    if (!commentId) throw new BadRequest('There is no post id')

    const comment = await Comment.findByPk(commentId)

    if (!comment) throw new NotFound('No comment with this id')

    return res.status(StatusCodes.OK).json({ data: comment })
}


const updateComment = async (req, res) => {
    const { commentId } = req.params

    if (!commentId) throw new BadRequest('There is no comment id')

    const validationResult = await updateCommentSchema.validateAsync(req.body)

    const comment = await Comment.findByPk(commentId)

    if (!comment) throw new NotFound('No comment found with this id')

    const result = await comment.update(validationResult)

    return res.status(StatusCodes.OK).json({ data: result })
}


const deleteComment = async (req, res) => {
    const { commentId } = req.params

    if (!commentId) throw new BadRequest('There is no post id')

    const comment = await Comment.findByPk(commentId)

    if (!comment) throw new NotFound('No comment with this id')

    const result = await comment.destroy()

    return res.status(StatusCodes.OK).json({ msg: 'The comment has been deleted' })
}


module.exports = {
    getAllComments,
    getComment,
    updateComment,
    deleteComment
}