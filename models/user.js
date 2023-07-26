const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    places: [{type : mongoose.Types.ObjectId,ref:'Place' ,required: true}],
})

module.exports = mongoose.model('User', userSchema);