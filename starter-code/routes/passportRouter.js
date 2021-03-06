/*jshint esversion: 6*/

const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});
//renderizar login
router.get('/login', function(req, res, next) {
  res.render('passport/login', { title: 'Express' });
});
//post login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

//renderiza pagina de signup
router.get('/signup', function(req, res, next) {
  res.render('passport/signup', { title: 'Express' });
});
//una vez rellenado formulario, comprueba que cumplan parametros
router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
//comprueba que ya exista el usuario
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }
//encripta contraseña
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
//crea nuevo usuario
    const newUser = User({
      username: username,
      password: hashPass
    });
//guarda el nuevo usuario
    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


module.exports = router;




module.exports = router;
