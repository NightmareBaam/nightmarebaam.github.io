var Resultat = require("../models/resultat");
var Grille = require("../models/grille");
const grille = require("../models/grille");
const ObjectId = require('mongoose').Types.ObjectId

exports.getByGrandPrix = function(req, res, next) {
  Resultat
  .aggregate([
    { $match: {grandPrix: parseInt(req.params.grandPrixId)}},
    { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
    { $lookup: {from: 'Grille', localField: 'grille', foreignField: '_id', as: 'grille' }},
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
  calculerPoints(res);
};

exports.getByGrandPrixId = function(req, res, next) {
  Resultat
  .aggregate([
    { $match: {grandPrix: parseInt(req.params.grandPrixId)}},
    { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
    { $unwind: {"path": "$grandPrix", "preserveNullAndEmptyArrays": true}}
  ])
  .exec(function(err, grilles) {
      if (err) {
        return next(err);
      }
      res.status(200).send(grilles);
    });
};

exports.getByUserId = function(req, res, next) {
  Resultat
  .aggregate([
    { $match: {user: parseInt(req.params.userId)}},
    { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
    { $unwind: {"path": "$grandPrix", "preserveNullAndEmptyArrays": true}}
  ])
  .exec(function(err, grilles) {
      if (err) {
        return next(err);
      }
      res.status(200).send(grilles);
    });
};

function calculerPoints(res) {
  Resultat
    .find({}, '-_id')
    .exec()
    .then((result) => {
      Grille.aggregate([
        { $match: {_id: {'$nin': result.map(x => ObjectId(x.grille))}}},
        { $lookup: {from: 'GrandPrix', localField: 'grandPrix', foreignField: '_id', as: 'grandPrix'}},
        { $lookup: {from: 'Pilotes', localField: 'grille.piloteId', foreignField: '_id', as: 'pilote'}},
        { $lookup: {from: 'Ecuries', localField: 'pilote.ecurie', foreignField: '_id', as: 'ecurie'}},
        /*
        {$addFields : {
          "pilote": 
          {$map : {
              input : "$pilote", 
              in : {
                $mergeObjects: [
                  "$$this",
                  {
                    "ecurie": {
                      "$cond": {
                        "if": {
                          "$eq": [
                            { "$indexOfArray": ["$ecurie._id", "$$this.ecurie"] },
                            -1
                          ]
                        },
                        "then": null,
                          "else": {
                            "$arrayElemAt": [
                              "$ecurie",
                              { "$indexOfArray": ["$ecurie._id", "$$this.ecurie"]}
                            ]}}}}]}}}}},
        {$addFields : {
          "grille": 
          {$map : {
              input : "$grille", 
              in : {
                $mergeObjects: [
                  "$$this",
                  {
                    "pilote": {
                      "$cond": {
                        "if": {
                          "$eq": [
                            { "$indexOfArray": ["$pilote._id", "$$this.piloteId"] },
                            -1
                          ]
                        },
                        "then": null,
                          "else": {
                            "$arrayElemAt": [
                              "$pilote",
                              { "$indexOfArray": ["$pilote._id", "$$this.piloteId"]}
                            ]}}}}]}}}}},
                            */
      {
        $group: {
          "_id": "$_id",
          "grandPrix": { $first: "$grandPrix"},
          "user": { $first: "$user" },
          "grille": { $first: "$grille" }
        }
      }
      ])
      .exec()
      .then((result) => {
        let results = [];
        result.forEach(grille => {
            let grilleGp = grille.grandPrix[0].grille;
            if (grilleGp
                && Object.keys(grilleGp).length === 0) {
              return;
            }
            let result = new Resultat({
              "grandPrix": grille.grandPrix[0]._id,
              "user": grille.user,
              "grille": grille._id,
              "points": getPoints(grille.grille, grilleGp)
            });
            results.push(result);
      })
      if (results.length == 0) {
        Resultat.find({}, '-_id -__v', function(err, grille) {
          if (err) return next(err);
          res.status(200).send(grille);
        });
      } else {
        Resultat.insertMany(results).then((results) => {
          console.log(results.length + " documents sauvegardés avec succès !")
          Resultat.find({}, '-_id -__v', function(err, grille) {
            if (err) return next(err);
            res.status(200).send(grille);
          });
        });
      }
    });
  })
}

  function getPoints(grilleJoueur, resultGrille) {
      grilleJoueur.sort((a, b) => a.position - b.position)
      resultGrille.sort((a, b) => a.position - b.position)
      let q3 = grilleJoueur.slice(0, 10);
      let resultQ3 = resultGrille.slice(0, 10);
      let q2 = grilleJoueur.slice(10, 15);
      let resultQ2 = resultGrille.slice(10, 15);
      let q1 = grilleJoueur.slice(15);
      let resultQ1 = grilleJoueur.slice(15);
      return getPointsSession(q1, resultQ1) + getPointsSession(q2, resultQ2) + getPointsSession(q3, resultQ3) + getExtraPoints(q3, resultQ3, q1, resultQ1);
  }

  function getPointsSession(grilleJoueur, resultGrille) {
      let count = 0;
      for (let i = 0; i < resultGrille.length; i++) {
          let isGood = resultGrille[i].piloteId == grilleJoueur[i].piloteId;
          if (!isGood) {
            let isIn = resultGrille.map(x => x.piloteId).includes(grilleJoueur[i].piloteId);
            if (!isIn) {
              if (resultGrille.map(x => x.ecurieId).filter(x => x.ecurieId == grilleJoueur[i].ecurieId).length == 1 && grilleJoueur.filter(x => x.ecurieId == grilleJoueur[i].ecurieId).length == 1) {
                let isEcurieIn = resultGrille.map(x => x.ecurieId).includes(grilleJoueur[i].ecurieId);
                if (isEcurieIn) {
                  count += 0.5
                }
              }
            } else {
              count += 1;
            }
          } else {
            count += 2;
          }
      }
      return count;
  }

  function getExtraPoints(q3, resultQ3, q1, resultQ1) {
      let count = 0;
      if (q3[0].piloteId == resultQ3[0].piloteId 
        && q3[1].piloteId == resultQ3[1].piloteId 
        && q3[2].piloteId == resultQ3[2].piloteId) {
          count += 2;
        }
      if (q1[4].piloteId == resultQ1[4].piloteId) {
          count += 0.5;
      }  
      return count;
  }