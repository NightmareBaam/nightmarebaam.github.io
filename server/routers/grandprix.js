var express = require("express");
var router = express.Router();
 
var grandPrixController = require("../controllers/grandprix");
 
router.get("/:id", grandPrixController.grandPrixGetById);

router.get("/:id/result", grandPrixController.getGrandPrixResult);
 
router.get("/", grandPrixController.allGrandPrix);
 
module.exports = router;