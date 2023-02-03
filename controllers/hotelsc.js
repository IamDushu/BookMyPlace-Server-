import Hotel from "../models/Hotel.js"
import Room from "../models/Room.js"

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body)

  try {
    const savedHotel = await newHotel.save() // save() function is used to save the document to the database
    res.status(200).json(savedHotel)
  } catch (err) {
    next(err)
  }
}

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    ) // mongoDB set method //Why {new:true}? cuz by default findByIdAndUpdate sends old data
    res.status(200).json(updatedHotel)
  } catch (err) {
    next(err)
  }
}

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id)
    res.status(200).json("Hotel has been Deleted!")
  } catch (err) {
    next(err)
  }
}

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
    res.status(200).json(hotel)
  } catch (err) {
    next(err)
  }
}

export const getAllHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query
  //http://localhost:8800/api/hotels?featured=true&limit=2&min=10&max=5000
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min || 1, $lt: max || 9999999 },
    }).limit(req.query.limit)
    res.status(200).json(hotels)
  } catch (err) {
    next(err)
  }
}

export const countByCity = async (req, res, next) => {
  //using queries i.e 'hotels/countByCity?cities=berlin,tirupati,chennai'
  const cities = req.query.cities.split(",") //transforms string to an array
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city })
        //MongoDB count Documents(faster), instead of using Hotel.find({city:city}).length
      })
    )
    res.status(200).json(list)
  } catch (err) {
    next(err)
  }
}

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" })
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" })
    const resortCount = await Hotel.countDocuments({ type: "resort" })
    const villaCount = await Hotel.countDocuments({ type: "villa" })
    const cabinCount = await Hotel.countDocuments({ type: "cabin" })

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ])
  } catch (err) {
    next(err)
  }
}

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelid)
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room)
      })
    )
    res.status(200).json(list)
  } catch (err) {
    next(err)
  }
}
