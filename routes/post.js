const express = require('express')
const router = express.Router()
const { 
    getPost, 
    createPost, 
    updatePost, 
    deletePost, 
    createPostComment,
    getPostComments,
    likePost,
    unlikePost,
    savePost,
    schedulePost,
    getAllPosts
} = require('../controllers/post')

// router.route('/testposts').get(testPosts)

router.route('/').get(getAllPosts).post(createPost)

router.route('/:postId').get(getPost).patch(updatePost).delete(deletePost)

router.route('/schedule').post(schedulePost)

router.route('/:postId/comments').post(createPostComment).get(getPostComments)

router.route('/:postId/like').post(likePost).delete(unlikePost)

router.route('/:postId/save').post(savePost)

module.exports = router