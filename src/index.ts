import express, {Request, Response} from 'express'
import "reflect-metadata"
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser"
import {runDb} from "./connect/db-connection";
import {authRouter} from "./routes/auth-router";
import {postsRouts} from "./routes/posts-router";
import {feedbacksRouter} from "./routes/feedbacks-router";
import {commentsRouter} from "./routes/comments-router";
import {emailRouter} from "./routes/email-router";
import {testingRouter} from "./routes/testing-router";
import {usersRouter} from "./routes/users-router";
import {blogsRouts} from "./routes/blogs-router";
import {securityDevicesRouter} from "./routes/securityDevices-router";
import {container} from "./Container";
import {EmailsSender} from "./demons/emailSender";
import {ClearingIpWithCreatedAtOlder10Sec} from "./demons/clearingIpWithCreatedAtOlder10Sec";
import {ClearingInvalidJWTFromBlackList} from "./demons/clearingInvalidJWTFromBlackList";
import {ClearingDevicesWithExpDate} from "./demons/clearingDevicesWithExpDate";


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

const port = process.env.PORT || 5000

app.set('trust proxy', true)

app.set('view engine', 'ejs')
app.get('/', (req: Request, res: Response) => {
  res.render('index')
})

app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/posts', postsRouts)
app.use('/blogs', blogsRouts)
app.use('/feedbacks', feedbacksRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)
app.use('/security', securityDevicesRouter)
app.use('/testing/', testingRouter)


const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
  })
}

startApp()
  .then(() =>
    [container.resolve(EmailsSender).sendAndDeleteConfirmationCode(),
      container.resolve(EmailsSender).sendAndDeleteRecoveryCode(),
      container.resolve(ClearingIpWithCreatedAtOlder10Sec).start(),
      container.resolve(ClearingInvalidJWTFromBlackList).start(),
      container.resolve(ClearingDevicesWithExpDate).start()
    ])

