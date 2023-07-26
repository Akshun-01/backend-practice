const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoute = require('./routes/place');
const usersRoute = require('./routes/user');

const app = express();
app.use(bodyParser.json());

app.use('/api/places', placesRoute);
app.use('/api/users', usersRoute);

// error handler
app.use((error,req, res, next) => {
    if(res.headerSent) {
        return next(error);
    } // to check if res has already been sent
    res.status(error.code || 500)
    res.json({message: error.message || "Unknown Error Occurred"})
})

mongoose
  .connect('mongodb+srv://akshun:akshun123@cluster0.o9saroj.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
