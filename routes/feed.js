const express = require('express')
const router = express.Router()
const {getUserFeed} = require('../controllers/post')


router.route('/').get(getUserFeed)


module.exports = router