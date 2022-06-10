import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {runDb} from "./repositories/db-connection";
import {authRouter} from "./routes/auth-router";
import {bloggersRouts} from "./routes/bloggers-router";
import {postsRouts} from "./routes/posts-router";
import {feedbacksRouter} from "./routes/feedbacks-router";
import {allDeletedBloggersRouts} from "./routes/all-deleted-bloggers-router";
import {usersRouter} from "./routes/users-router";
import {commentsRouter} from "./routes/comments-router";
import {emailRouter} from "./routes/email-router";
import {emailSender} from "./demonEmailSender/emailSender";



const app = express()
const corsMiddleware = cors()
app.use(corsMiddleware)

const jsonBodeMiddleware = bodyParser
app.use(jsonBodeMiddleware.json())

const port = process.env.PORT || 5000


app.set('view engine', 'ejs')
app.get('/', (req: Request, res: Response) => {
  res.render('index')
})

app.use('/posts', postsRouts)
app.use('/bloggers', bloggersRouts)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/feedbacks', feedbacksRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)


app.use('/deleted-bloggers', allDeletedBloggersRouts)



const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
  })
}

startApp()
emailSender()
