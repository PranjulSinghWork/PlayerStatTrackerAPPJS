const express = require('express');
const router = express.Router();
const Player = require("../models/player")
const Team = require('../models/team');
const player = require('../models/player');
const path = require('path');
const defaultImg = 'default.png'; // replace with your actual default image path


//using multer to have file upload functionality
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/') // Ensure the `./public/uploads/` directory exists.
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Define the naming convention of uploaded files.
  }
})

const upload = multer({ storage: storage })

//user auth
function userLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
router.get("/", (req, res, next) => {
  

    Player.find((err, players) => {
        if(err){
            console.log(err);
        } else {
            res.render("players/index", {
                title: "Player Stats",
                dataset: players,
                user: req.user
            });
        }
    })
});

router.get("/add",userLoggedIn, (req, res, next) => {
    //
    Team.find((err, teams)=>{
        if(err){console.log(err)}
        else{
            res.render("players/add", {title: "Add a Player", teams: teams,user: req.user});
        }
    }).sort({name: 1});
});

//Post Handler
router.post("/add", userLoggedIn,  upload.single('playerImage'),(req, res, next) => {
    let imagePath = defaultImg;
    //handling condition when there is no image uploaded
    if (req.file && req.file.filename) {
        imagePath = '/uploads/' + req.file.filename;
    } else {
        console.log("Using default image.");
    }
    Player.create({
        name: req.body.name,
        height: req.body.height,
        pointPGame: req.body.pointPGame,
        team: req.body.team,
        imageUrl:  imagePath

    }, (err, newPlayer)=>{
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/players");
        }
    })
} )

router.get('/delete/:_id',userLoggedIn, (req,res, next) =>{
    Player.remove({
        _id: req.params._id
    },
    (err) => {
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/players");
        }
    }
    )
});

router.get('/edit/:_id', userLoggedIn,(req, res, next) => {
    Player.findById(req.params._id, (err, player) => {
        if (err) {
            console.log(err);
        } else {
            Team.find((err, teams) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('players/edit', { title: 'Edit', player: player, teams: teams, user: req.user });
                }
            });
        }
    });
});

router.post('/edit/:_id', userLoggedIn,(req, res, next)=>{
    Player.findOneAndUpdate(
        {_id: req.params._id},
        {
            name: req.body.name,
            height: req.body.height,
            pointPGame: req.body.pointPGame,
            team: req.body.team
        },
        (err, updatePlayer) =>{
            if(err){
                console.log(err )

            }else{
                res.redirect('/players')
            }
        }

    )
})


module.exports = router;