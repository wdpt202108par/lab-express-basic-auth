const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
{
  username: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    required: [true, "Username is required"],
    unique: [true, "Username already exists"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }
},
{
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;
