const express = require('express')
const router = express.Router()
const { registrationHandler, loginHandler, logoutHandler, refreshTokenHandler } = require('../controllers/auth')


router.route('/register').post(registrationHandler)

router.route('/login').post(loginHandler)

router.route('/refresh-token').get(refreshTokenHandler)

router.route('/logout').get(logoutHandler)


module.exports = router