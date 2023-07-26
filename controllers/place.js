const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Place = require('../models/place');
const User = require('../models/user');

const HttpError = require('../models/http-error');

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

  let user;
  try{
    user = await User.findById(creator);
  }catch(err){
    return next(new HttpError(err, 404));
  }

  if(!user){
    return next(new HttpError("User not found", 404));
  }

  try{
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({session: session});
    user.places.push(createdPlace);
    await user.save({session: session});
    await session.commitTransaction();
  }catch(err){
    return next(new HttpError(err,500));
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
    place = await Place.findById(placeId).populate('creator');
  }catch(err){
    return next(new HttpError(err,404));
  }
  if(!place){
    return next(new HttpError("Could Not find place for this id", 404));
  }

  try{
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({session: session});
    place.creator.places.pull(place);
    await place.creator.save({session: session});
    await session.commitTransaction();
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