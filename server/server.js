// server.js
var express = require("express");
var bodyParser = require("body-parser");
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login'); //authorization
var LocalStrategy = require('passport-local').Strategy;

//CONFIG
var mongoconfig = require("./config/mongodb-config");
var port = process.env.PORT || 5000;
var sha512 = require('js-sha512');

const Utilisateurs = require('./models/users.js');
//CONTROLLER
var ecuries = require("./routers/ecuries"); // Imports routes for ecuries
var grandPrix = require("./routers/grandprix"); // Imports routes for grand prix
var pilotes = require("./routers/pilotes"); // Imports routes for pilotes
var grille = require("./routers/grille"); // Imports routes for grille
var resultat = require("./routers/resultat"); // Imports routes for resultat 

//CONNECTION DATABASE
var mongoose = require("mongoose");
var mongoDB = process.env.MONGODB_URI || mongoconfig.url;
 
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//APP + CONFIG 
var app = express();
// Configure Sessions Middleware
app.use(session({
  secret: 'am/*5za&AjD+-[[jdzaow28AQJd]{;##zSmPP',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60*60*1000} //1 Hour
})) 
// configure app to use bodyParser(), this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Configure More Middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport Local Strategy
passport.use(new LocalStrategy(
  // function of username, password, done(callback)
  function(username, password, done) {
    // look for the user data
    Utilisateurs.findOne({ username: username }, function (err, user) {
      // if there is an error
      if (err) { return done(err); }
      // if user doesn't exist
      if (!user) { return done(null, false, { message: 'User not found.' }); }
      // if the password isn't correct
      if (user.password !== sha512(password)) { return done(null, false, {   
      message: 'Invalid password.' }); }
      // if the user is properly authenticated
      return done(null, user);
    });
  }
));
// To use with sessions
passport.serializeUser(Utilisateurs.serializeUser());
passport.deserializeUser(Utilisateurs.deserializeUser());
// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
 

//ROUTES
// routes
var router = express.Router();
// chain routers
// all of the routers will be prefixed with /api
router.use("/ecuries", connectEnsureLogin.ensureLoggedIn(), ecuries); 
router.use("/grandPrix", connectEnsureLogin.ensureLoggedIn(), grandPrix); 
router.use("/pilotes", connectEnsureLogin.ensureLoggedIn(), pilotes); 
router.use("/grille", connectEnsureLogin.ensureLoggedIn(), grille)
router.use("/resultat", resultat)

//LOGIN 
// Route to Log out
router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).send();
});

// Post Route: /login
router.post('/login', passport.authenticate('local'),  function(req, res) {
  res.status(200).send();
});

// Register the 'root' router
app.use("/api", router);
 
app.listen(port, () => {
  console.log("Server is up and running on port number " + port);
});