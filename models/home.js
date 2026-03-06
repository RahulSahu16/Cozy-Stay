const Favourite = require("./favourite");
const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  imageURL: { type: String, required: true },
  description: { type: String, required: true },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

homeSchema.pre('findOneAndDelete', async function() {
  const homeId = this.getFilter()["_id"];
  await Favourite.deleteMany({ homeId: homeId });
});

module.exports = mongoose.model("Home", homeSchema);
