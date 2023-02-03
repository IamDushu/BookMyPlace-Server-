import express from "express"
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getAllHotels,
  getHotelRooms,
  getHotel,
  updateHotel,
} from "../controllers/hotelsc.js"
import { verifyAdmin } from "../utils/verifyToken.js"

const router = express.Router()

//CREATE
router.post("/", verifyAdmin, createHotel) //verifyAdmin - Authentication

//UPDATE
router.put("/:id", verifyAdmin, updateHotel)

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel)

//GET
router.get("/find/:id", getHotel) //if not /find/:id then /countBycity will be error

//GET ALL
router.get("/", getAllHotels)

router.get("/countByCity", countByCity)
router.get("/countByType", countByType)
router.get("/rooms/:hotelid", getHotelRooms)

export default router
