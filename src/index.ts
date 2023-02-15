import express from 'express'
import bodyParser from "body-parser";
import { runDb } from './repositories/db';
import { authRouter } from './routes/auth-router';
import { blogsRouter } from './routes/blog-router';
import { postsRouter } from './routes/post-router';
import { testingRouter } from './routes/testing-router';
import { usersRouter } from './routes/user-router';
const app = express()
const port = process.env.PORT || 3000;

const jsonBodyMiddleware = bodyParser.json()
app.use (jsonBodyMiddleware)

//прописываем наши роуты
app.use('/auth', authRouter) 
app.use('/blogs', blogsRouter) 
app.use('/posts', postsRouter) 
app.use('/testing', testingRouter)
app.use('/users', usersRouter)



const startApp = async () => {
  await runDb();
  app.listen(port, () => {
  console.log("Example app listening on port: ${port}");
  });
 };
 startApp();
