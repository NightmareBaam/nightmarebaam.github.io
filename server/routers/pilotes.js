var express = require("express");
var router = express.Router();
 
var pilotesController = require("../controllers/pilotes");
 
router.get("/:id", pilotesController.getById);
 
router.get("/", pilotesController.getAll);
 
module.exports = router;