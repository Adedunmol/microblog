const Joi = require('joi')


const registrationSchema = Joi.object({
    username: Joi.string().required().min(4),
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const postSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required()
})

const updatePostSchema = Joi.object({
    title: Joi.string(),
    body: Joi.string()
})


const commentSchema = Joi.object({
    body: Joi.string().required()
})

const scheduledPostSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    date: Joi.string().required()
})

const updateUserSchema = Joi.object({
    username: Joi.string().min(4),
    email: Joi.string().email(),
    password: Joi.string()
})


const updateCommentSchema = Joi.object({
    body: Joi.string(),
    disabled: Joi.boolean()
})


module.exports = {
    registrationSchema,
    loginSchema,
    postSchema,
    updatePostSchema,
    commentSchema,
    scheduledPostSchema,
    updateUserSchema,
    updateCommentSchema
}