import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"

import cookieParser from "cookie-parser"
import cors from "cors"

import authRoute from "./routes/auth.js" // dont forget to add .js in here
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"

const app = express()
dotenv.config()

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log("connected to mongoDB")
  } catch (error) {
    throw error
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB Disconnected!")
})
mongoose.connection.on("connected", () => {
  console.log("mongoDB Connected!")
})

//middlewares - whenever we make an api request it checks through all middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json()) // to use req.body

app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/hotels", hotelsRoute)
app.use("/api/rooms", roomsRoute)

//Error Handling Middleware//if above routes fail then this error middleware gets used
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong!"
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

app.listen(8800, () => {
  connect()
  console.log("connected to backend.")
})
