//jshint esversion:6
/*HyperTerminal-----------------------------------------------------------------
mkdir Security-SignUp_SignIn_with_Google-Facebook
npm init -y
npm i express body-parser ejs  mongoose
npm i dotenv
npm i express-session  passport  passport-local  passport-local-mongoose
npm i passport-google-oauth20  passport-facebook
npm i mongoose-findorcreate
*/

//Require packgages-------------------------------------------------------------
require("dotenv").config(); // must be at top. Not used in this file currently.

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy; //G.1
const FacebookStrategy = require("passport-facebook").Strategy; //F.1
const findOrCreate = require("mongoose-findorcreate");


//Create&Use app----------------------------------------------------------------
const app = express(); //Create a new app instance using express


app.use(express.static("public")); //Tell the app to use all the statics files inside the public folder
app.set("view engine", "ejs"); //Tell the app to use EJS as its view engine as the templating engine

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies. //Require body-parser module to parser the requests

app.use(session( //Set up express session
  { //js object
  secret: "Our little secret.",  // should be inside an environment variable
  resave: false,
  saveUninitialized: false
  }
));

app.use(passport.initialize()); //initialize and start using passport.js
app.use(passport.session()); //Tell the app to use passport to also setup the session


//Connect to Database, CRUD-----------------------------------------------------
// "userDB" is the name of the database
//mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true } );
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true}); //Connect to mongoDB
// mongoose.set("useCreateIndex", true); // seems unnecessary now

// Create the schema ( == blueprint) for the database. This is required when using Mongoose
const userSchema = new mongoose.Schema({ //create userSchema as object from the mongoose.Schema class
  email: String,
  password: String,
  username: String,
  googleId: {type: String, unique: true}, //G.2
  facebookId: {type: String, unique:true}, //F.2
  secret: String
});

userSchema.plugin(passportLocalMongoose); //add userSchema as a plugin. That is what we will use to hash and salt the passwords and to save the users into the mongoDB database
userSchema.plugin(findOrCreate);

const User = new mongoose.model("USER", userSchema); //Setup a new User model and specify the name of the collection USER


//Create Strategies-------------------------------------------------------------
/*Create a strategy which is going to be the local strategy to authenticate users using their username and password and also to serialize and deserialize the user
Serialize the user is to basically create the cookie and add inside the message, namely the user's identification into the cookie
Deserialize the user is to basically allow passport to be able to crumble the cookie and discover the message
inside which is who the user is all of the user's identification so that we can authenticate the user on the server*/
passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Google Strategy //G.3
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/roby",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
  function (request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


//Facebook Strategy //F.3
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/robyroute"
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


//Add some GETs to view the EJS files/websites----------------------------------
// TODO
app.get("/", function (req, res) {
  res.render("home");
});


//Add a button for Google in register/ejs and the same in login.ejs //G.4
//Google Authentication //G.5
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get("/auth/google/roby",   //   callbackURL: "http://localhost:3000/auth/google/roby",
  passport.authenticate("google", { failureRedirect: "/login" }), function (req, res) {
    res.redirect("/secrets"); //Successful authentication, redirect to secrets
  }
);

//Add a button for Google in register/ejs and the same in login.ejs //F.4
//Facebook Authentication //F.5
app.get("/auth/facebook",
  passport.authenticate("facebook")
);
app.get("/auth/facebook/robyroute", //callbackURL: "https://localhost:3000/auth/facebook/robyroute"
 passport.authenticate("facebook", { failureRedirect: "/login" }), function (req, res) {
    res.redirect("/secrets"); //Successful authentication, redirect to secrets
});


app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  User.find({ "secret": { $ne: null } }, function (err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", { usersWithSecrets: foundUsers });
      } else {
        console.log(err);
      }
    }
  });
});
//Add usersWithSecrets in secrets.ejs


app.get("/submit", function (req, res) {
  if (req.isAuthenticated()) { //if a user is already logged in
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

//POST--------------------------------------------------------------------------
app.post("/submit", function (req, res) {
  //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  console.log(req.user.id);
  User.findById(req.user.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = req.body.secret;
        foundUser.save(function () {
          res.redirect("/secrets");
        });
      }
    }
  });
});

//GET--------------------------------------------------------------------------
app.get("/logout", function (req, res, next) {
  //https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
  req.logout (function(err) { //deauthenticate the user and end the user session
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


//POST--------------------------------------------------------------------------
//post the username and password the user enter when registering
app.post("/register", function (req, res) {

  //Now we will incorporate hashing and salting and authentication using passport.js and the packages just added (passport passport-local passport-local-mongoose express-session)
  /*Tap User model& call register(), this method comes from passport-local-mongoose
  which will act as a middle-man to create and save the new user and to interact with mongoose directly js object -> {username: req.body.username} */
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        //if the authentication is successfull and we managed to successfully setup a cookie that saved their current logged in session
        res.redirect("/secrets");
      });
    }
  });
});


/*This is the new login route, which authenticates first and then does the login (which is required to create the session, or so I understood from the passport.js documentation).
A failed login (wrong password) will give the browser error "unauthorized".*/
app.post("/login", function (req, res) {

  // Create a new document called user  from  the mongoose Model called User
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  //Now use passport to login the user and authenticate him - take the user created from above
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});


//Set up the server to listen to port: 3000 or PORT-----------------------------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});


//===========================End the code======--===============================
/*
Test:---------------------------------------------------------------------------
db.users.drop()
localhost:3000 - Register - SignUp with Facebook
the should show the secret page!
*/

/*Github------------------------------------------------------------------------
Create a new repository: https://github.com/new
Repository name: Security-SignUp_SignIn_with_Google-Facebook
Create repository

…or push an existing repository from the command line:
  git remote add origin https://github.com/robertodatja/Security-SignUp_SignIn_with_Google-Facebook.git
  git branch -M main
  git push -u origin main
-Copy those lines above and paste into HyperTerminal


//Hyperterminal-----------------------------------------------------------------
git log
git config --global user.email "robert.datja@gmail.com"
git config --global user.name "Roberto Datja"
git init
git log

git add .
git commit -m "SignUp or Sign In with Google or Facebook"
git log

git remote add origin https://github.com/robertodatja/Security-SignUp_SignIn_with_Google-Facebook.git
git branch -M main
git push -u origin main

//If you make any other change,then write:
git add .
git commit -m "I make some changes"
git log
git push -u origin main

*/
