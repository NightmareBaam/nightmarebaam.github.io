var Ecuries = require("../models/ecuries");

exports.ecuries_readone = function(req, res, next) {
    Ecuries.findById(req.params.id, function(err, ecurie) {
    if (err) {
      return next(err);
    }
    res.status(200).send(ecurie);
  });
};
 
exports.ecuries_all = function(req, res, next) {
  Ecuries.find({}, function(err, ecuries) {
    if (err) return next(err);
    res.status(200).send(ecuries);
  });
};