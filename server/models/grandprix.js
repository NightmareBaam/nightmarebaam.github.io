var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var grandPrixSchema = new Schema({
  _id: { type: Number, required: true },
  nom: { type: String, required: true, max: 40 },
  date: { type: Date, required: true },
  grille: [{ position: Number, piloteId: Number }]
}, 
{
  collection: 'GrandPrix'
});
 
// Export the model
module.exports = mongoose.model("GrandPrix", grandPrixSchema);
