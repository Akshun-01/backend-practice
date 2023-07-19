const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    title : {type: 'string'},
    description : {type: 'string'},
    address: {type: 'string'},
    creator : {type: 'string'},
});

module.exports = mongoose.model('Place', placeSchema);