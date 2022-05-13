import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {authRouter} from "./middlewares/auth-middleware";
import {runDb} from "./repositories/db-connection";
import {bloggersRouts} from "./routes/bloggers-router";
import {postsRouts} from "./routes/posts-router";
import {feedbacksRouter} from "./routes/feedbacks-router";
import {allDeletedBloggersRouts} from "./routes/all-deleted-bloggers-router";
import {usersRouter} from "./routes/users-router";



const app = express()
const corsMiddleware = cors()
app.use(corsMiddleware)

const jsonBodeMiddleware = bodyParser
app.use(jsonBodeMiddleware.json())

const port = process.env.PORT || 5000


app.get('/', (req: Request, res: Response) => {
  res.send('Learning Node.js, Express, {api: [bloggers, posts, users, feedback]}');
})

app.use('/posts', postsRouts)
app.use('/bloggers', bloggersRouts)
app.use('/bloggers/', bloggersRouts)
app.use('/users', authRouter, usersRouter)
app.use('/auth', authRouter)
app.use('/feedbacks', feedbacksRouter)

app.use('/deleted-bloggers', allDeletedBloggersRouts)



const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
  })
}

startApp()
