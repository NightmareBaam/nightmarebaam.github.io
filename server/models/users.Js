var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
 
var usersSchema = new Schema({
  username: { type: String, required: true},
  password: { type: String, required: true }
}, 
{
  collection: 'Utilisateurs'
});

usersSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("Utilisateurs", usersSchema, 'Utilisateurs');
