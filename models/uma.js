const mongoose = require("mongoose");

const umaScheme = new mongoose.Schema({
  name: String,
  hair_color: String,
  eye_color: String,
  height: String,
  avatar: String,
  user: String,
});

umaScheme.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Uma", umaScheme);
