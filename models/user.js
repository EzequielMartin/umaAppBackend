const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  passwordHash: String,
  umas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uma",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

//El mongoose.models.User hace que no me tire el error de model duplicado, antes me tiraba este error: OverwriteModelError: Cannot overwrite `User` model once compiled.
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
