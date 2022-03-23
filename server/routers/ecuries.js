var express = require("express");
var router = express.Router();
 
var ecuries_controller = require("../controllers/ecuries");
 
router.get("/:id", ecuries_controller.ecuries_readone);
 
router.get("/", ecuries_controller.ecuries_all);
 
module.exports = router;