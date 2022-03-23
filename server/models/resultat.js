var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var resultatSchema = new Schema({
  grandPrix: { type: Number, required: true },
  user: { type: String, required: true },
  grille: { type: Schema.Types.ObjectId, required: true}, 
  points: Number
}, 
{
  collection: 'Resultat'
});
 
// Export the model
module.exports = mongoose.model("Resultat", resultatSchema);
