var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , user: req.user});
});

router.get('/login', (req, res, next) =>{
  let messages = req.session.messages || [];
 req.session.message = [];

  res.render('login', {title: "Login to Your Account", messages: messages, user: req.user});
});

router.get('/register', (req, res, next)=>{
  res.render('register', {title: "Register For an Account"})
})
router.post('/login', passport.authenticate("local",{
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'

}))
router.post('/register', (req, res, next)=>{
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, newUser) => {
      if(err){
        return res.redirect('/register');

      }else{
        req.login(newUser, (err)=> {
          res.redirect('/players')
        })
      }
    }
  )
})

router.get('/logout', (req, res, next)=> {
  req.logout((err) => {
    res.redirect('/login')
  })
})

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user.email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res, next) => {
    res.redirect("/players");
  }
);
module.exports = router;
