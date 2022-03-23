var Pilotes = require("../models/pilotes");

exports.getById = function(req, res, next) {
  Pilotes
  .aggregate([
    { $match: {_id: parseInt(req.params.id)}},
    { $lookup: {from: 'Ecuries', localField: 'ecurie', foreignField: '_id', as: 'ecurie'}},
    { $unwind: {"path": "$ecurie", "preserveNullAndEmptyArrays": true}}
  ])
  .exec(function(err, pilote) {
      if (err) {
        return next(err);
      }
      res.status(200).send(pilote[0]);
    });
};
 
exports.getAll = function(req, res, next) {
  Pilotes
  .aggregate([
    { $lookup: {from: 'Ecuries', localField: 'ecurie', foreignField: '_id', as: 'ecurie'}},
    { $unwind: {"path": "$ecurie", "preserveNullAndEmptyArrays": true}}
])
  .exec(function(err, pilotes) {
      if (err) {
        return next(err);
      }
      res.status(200).send(pilotes);
    });
};