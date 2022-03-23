var Grille = require("../models/grille");

exports.getById = function(req, res, next) {
  Grille
  .aggregate([
    { $match: {_id: parseInt(req.params.id)}},
    { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
    { $unwind: {"path": "$grandPrix", "preserveNullAndEmptyArrays": true}}
  ])
  .exec(function(err, grille) {
      if (err) {
        return next(err);
      }
      res.status(200).send(grille[0]);
    });
};
 
exports.findAll = function(req, res, next) {
  Grille.find({}, function(err, grille) {
    if (err) return next(err);
    res.status(200).send(grille);
  });
};

exports.getByGrandPrixId = function(req, res, next) {
  Grille
  .aggregate([
    { $match: {grandPrix: parseInt(req.params.grandPrixId)}},
    { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
    { $lookup: {from: 'Pilotes', localField: 'grille.piloteId', foreignField: '_id', as: 'pilote'}},
    { $unwind: {"path": "$grandPrix", "preserveNullAndEmptyArrays": true}}
  ])
  .exec(function(err, grilles) {s
      if (err) {
        return next(err);
      }
      res.status(200).send(grilles);
    });
};

exports.getByUserId = function(req, res, next) {
  Grille
  .aggregate([
    { $match: {user: parseInt(req.params.userId)}},
    { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
    { $lookup: {from: 'Pilotes', localField: 'grille.piloteId', foreignField: '_id', as: 'pilote'}},
    { $unwind: {"path": "$grandPrix", "preserveNullAndEmptyArrays": true}}
  ])
  .exec(function(err, grilles) {
      if (err) {
        return next(err);
      }
      res.status(200).send(grilles);
    });
};