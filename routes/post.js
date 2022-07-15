const express = require('express')
const router = express.Router()
const { 
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
} = require('../controllers/post')


router.route('/').get(getAllPosts).post(createPost)

router.route('/:postId').get(getPost).patch(updatePost).delete(deletePost)

router.route('/schedule').post(schedulePost)

router.route('/:postId/comments').post(createPostComment).get(getPostComments)

router.route('/:postId/like').post(likePost).delete(unlikePost)

router.route('/:postId/save').post(savePost)

module.exports = router