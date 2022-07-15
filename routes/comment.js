const express = require('express')
const router = express.Router()
const { getAllComments, getComment, updateComment, deleteComment } = require('../controllers/comment')


router.route('/').get(getAllComments)

router.route('/:commentId').get(getComment).patch(updateComment).delete(deleteComment)


module.exports = router