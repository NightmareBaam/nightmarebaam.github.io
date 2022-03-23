var GrandPrix = require("../models/grandPrix");

exports.grandPrixGetById = function(req, res, next) {
  GrandPrix.findById(req.params.id, '_id nom date', function(err, grandPrix) {
    if (err) {
      return next(err);
    }
    res.status(200).send(grandPrix);
  });
};
 
exports.allGrandPrix = function(req, res, next) {
  GrandPrix.find({}, '_id nom date', function(err, grandPrix) {
    if (err) return next(err);
    res.status(200).send(grandPrix);
  });
};

exports.getGrandPrixResult = function(req, res, next) {
  GrandPrix.findById(req.params.id, function(err, grandPrix) {
    if (err) return next(err);
    res.status(200).send(grandPrix);
  });
};