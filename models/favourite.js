const mongoose = require('mongoose');
const home = require('./home');

const favouriteSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true,
    unique: true
  }
})

module.exports = mongoose.model("Favourite", favouriteSchema);