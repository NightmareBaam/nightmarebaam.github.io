var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var ecurieSchema = new Schema({
  _id: { type: Number, required: true },
  nom: { type: String, required: true, max: 40 }
}, 
{
  collection: 'Ecuries'
});
 
// Export the model
module.exports = mongoose.model("Ecuries", ecurieSchema);
