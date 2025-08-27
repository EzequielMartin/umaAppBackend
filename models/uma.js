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

//El mongoose.models.Uma hace que no me tire el error de model duplicado, antes me tiraba este error: OverwriteModelError: Cannot overwrite `Uma` model once compiled.
const Uma = mongoose.models.Uma || mongoose.model("Uma", umaScheme);

module.exports = Uma;
