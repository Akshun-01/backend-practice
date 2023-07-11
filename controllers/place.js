const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId);

    if(!place){
      return next(new HttpError("Invalid place", 404));
    }
    res.json(place);
}

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find(u => u.creator === userId);

  if(!place){
    return next(new HttpError("User Not Found", 404));
  }
  res.json(place);
}

const createPlace = (req, res, next) => {
  const {title, description, coordinates, address, creator} = req.body;
  const createdPlace = {
    id: uuidv4(), // generate random id
    title,
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({place : createdPlace});
}

const updatePlace = (req, res, next) => {

}

const deletePlace = (req, res, next) => {

}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;