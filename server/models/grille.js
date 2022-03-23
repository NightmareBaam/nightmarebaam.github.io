var mongoose = require("mongoose");
var Schema = mongoose.Schema;
 
var grilleSchema = new Schema({
  _id: { type: Number, required: true },
  grandPrix: { type: Number, required: true },
  user: { type: String, required: true },
  grille: [{ position: Number, piloteId: Number }]
}, 
{
  collection: 'Grille'
});
 
// Export the model
module.exports = mongoose.model("Grille", grilleSchema);
