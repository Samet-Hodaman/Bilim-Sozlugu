import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import mailRoutes from './routes/mail.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'

dotenv.config()

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("MongoDb is connected."))
  .catch((err) => console.log(err))

const __dirname = path.resolve()
const PORT = 8000

const app = express()

app.use(express.json())
app.use(cookieParser());
app.use(cors({origin: true}))

app.get('/test',(req,res) => {
  res.send("Working")
})

app.listen(PORT, (req,res) => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/mail', mailRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode  || 500
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})