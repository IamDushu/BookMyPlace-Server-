import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt) //Our passwords must not be visible on DB, so

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    })

    await newUser.save()
    res.status(200).send("User has been created.")
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return next(createError(404, "User not found!"))

    const isPasswordCorrect = await bcrypt.compareSync(
      req.body.password,
      user.password
    )
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"))

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    )
    //Object Destructuring
    const { password, isAdmin, ...otherDetails } = user._doc //To not send password, isAdmin info to client side
    res
      .cookie("access_token", token, {
        //Inaccessible to JavaScript Document.cookie API;(XSS) attacks.
        httpOnly: true, //using cookieParser
      })
      .status(200)
      .json({ ...otherDetails })
  } catch (err) {
    next(err)
  }
}
