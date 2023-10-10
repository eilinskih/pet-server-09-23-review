import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import cookieParser from 'cookie-parser'

import userRoutes from './routes/user.route'

dotenv.config()

const app = express()
const port = 3001
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use('/users', userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
