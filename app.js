require('dotenv').config()
require('express-async-errors')

const sequelize = require('./config/dbConn')
const morgan = require('morgan')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

const { initialize_roles } = require('./models')

const notFound = require('./middlewares/not-found')
const errorHandler = require('./middlewares/errorHandler')
const verifyRoles = require('./middlewares/verifyRoles')
const verifyJWT = require('./middlewares/verifyJWT')
const postSchedulerEvent = require('./events/schedulePost')

const postRouter = require('./routes/post')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const commentRouter = require('./routes/comment')
const { ROLES_LIST } = require('./config/roles_list')
const { schedule } = require('./jobs/scheduler')

app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))

postSchedulerEvent.on('schedule-post', (data) => {
    schedule.schedulePost(data, data.date)
})

app.use('/api/v1/home', [verifyJWT, verifyRoles(ROLES_LIST.Admin)], (req, res) => {
    return res.send('Home page')
})

app.use('/api/v1/auth', authRouter)

app.use(verifyJWT)

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/comments', commentRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

sequelize.authenticate().then(async () => {
    console.log('Database Connected...')
    await sequelize.sync({ alter: true })
    initialize_roles()
    console.log('Database Synced...')
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`)
    })
})