const express = require('express')
const router = express.Router()
const { getUser, updateUser, getFollowers, followUser, getFollowing, unfollowUser, getUserPosts } = require('../controllers/user')

router.route('/:userId/posts').get(getUserPosts)

router.route('/:userId').get(getUser).patch(updateUser)

router.route('/:userId/follow').post(followUser)

router.route('/:userId/unfollow').post(unfollowUser)

router.route('/:userId/followers').get(getFollowers)

router.route('/:userId/following').get(getFollowing)

module.exports =  router