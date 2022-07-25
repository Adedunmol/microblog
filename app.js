require('dotenv').config()
require('express-async-errors')

const sequelize = require('./config/dbConn')
const morgan = require('morgan')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./swagger.yaml')

const { initialize_roles } = require('./models')

const notFound = require('./middlewares/not-found')
const errorHandler = require('./middlewares/errorHandler')
const verifyRoles = require('./middlewares/verifyRoles')
const verifyJWT = require('./middlewares/verifyJWT')
const updateLastSeen = require('./middlewares/updateLastSeen')
const postSchedulerEvent = require('./events/schedulePost')

const postRouter = require('./routes/post')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const commentRouter = require('./routes/comment')
const feedRouter = require('./routes/feed')
const { ROLES_LIST } = require('./config/roles_list')
const { schedule } = require('./jobs/scheduler')

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
}))
app.use(cors())
app.use(helmet())
app.use(xss())
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))

postSchedulerEvent.on('schedule-post', (data) => {
    schedule.schedulePost(data, data.date)
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/home', (req, res) => {
    return res.send(`<h1>node-microblog-api</h1>
                    <a href="/api-docs">Go to Docs</a>`)
})

app.use('/api/v1/auth', authRouter)

app.use(verifyJWT)
app.use(updateLastSeen)
app.use('/api/v1/feed', feedRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/comments', commentRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

sequelize.authenticate().then(async () => {
    console.log('Database Connected...')
    await initialize_roles()
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}...`)
    })
})