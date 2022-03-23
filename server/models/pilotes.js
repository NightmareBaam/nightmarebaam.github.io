var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var pilotesSchema = new Schema({
  _id: { type: Number, required: true },
  numero: { type: Number, required: true},
  nom: { type: String, required: true, max: 40 },
  prenom: { type: String, required: true, max: 40 },
  abrev: { type: String, required: true, max: 3 },
  ecurie: { type: Number, required: true }
}, 
{
  collection: 'Pilotes'
});


 
// Export the model
module.exports = mongoose.model("Pilotes", pilotesSchema);
