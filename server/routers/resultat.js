var express = require("express");
var router = express.Router();
 
var resultatController = require("../controllers/resultat");
 
router.get("/grandprix/:grandPrixId", resultatController.getByGrandPrixId);

router.get("/", resultatController.findAll);
 
module.exports = router;