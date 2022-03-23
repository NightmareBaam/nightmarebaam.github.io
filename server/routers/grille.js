var express = require("express");
var router = express.Router();
 
var grilleController = require("../controllers/grille");
 
router.get("/:id", grilleController.getById);

router.get("/", grilleController.findAll);
 
router.get("/grandprix/:grandPrixId", grilleController.getByGrandPrixId);

router.get("/user/:userId", grilleController.getByUserId);
 
module.exports = router;