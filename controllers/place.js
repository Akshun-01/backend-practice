const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Place = require('../models/place');

const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
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

const getPlaceById = async(req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err){
    return next(new HttpError(err,404));
  }
  if (!place) {
    return next(new HttpError("Invalid place", 404));
  }
  res.json(place.toObject({getters: true}));
}

const getPlacesByUserId = async(req, res, next) => {
  const userId = req.params.uid;
  let places;
  try{
    places = await Place.find({creator: userId});
  }catch(err){
    return next(new HttpError(err,404));
  }

  if (!places) {
    return next(new HttpError("User Not Found", 404));
  }
  res.json(places.map(place => place.toObject({getters: true})));
}

const createPlace = async(req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(new HttpError("Invalid inputs, please try again", 422));
  }
  const { title, description, address, creator } = req.body;
  let createdPlace = new Place({
    title,
    description,
    address,
    creator
  });

  try{
    await createdPlace.save();
  }catch(e){
    return next(new HttpError(e,500));
  }
  res.status(201).json({ place: createdPlace });
}

const updatePlace = async(req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }

  const { title, description} = req.body;
  const placeId = req.params.pid;
  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err){
    return next(new HttpError(err,404));
  }

  if (!place) {
    return next(new HttpError("Place with given id does not exist", 404));
  }

  place.title= title;
  place.description= description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.',500));
  }

  res.status(200).json(place);
}

const deletePlace = async(req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err){
    return next(new HttpError(err,404));
  }

  try{
    await place.deleteOne();
  }catch(err){
    return next(new HttpError(err,500));
  }

  res.status(200).json({message : "Deleted place with give id"});
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;