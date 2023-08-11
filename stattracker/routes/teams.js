const express = require('express');
const router = express.Router();
const Team = require('../models/team');
function userLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

//GET Handler
router.get('/', (req, res, next) =>{
    Team.find((err, teams)=> {
        if (err) {console.log(err);}
        else{
            res.render('teams/index', {title: 'All Teams', dataset: teams, user: req.user});
        }
    });
});

router.get('/add', userLoggedIn,(req, res, next) =>{
    res.render('teams/add', {title: 'Add a new Team', user: req.user});


});

router.post('/add', (req, res, next) => {
    Team.create(
        {
            name: req.body.name,
            user: req.user
        },
        (err, newTeam) =>{
            if(err) {console.log(err);}
            else{
                res.redirect('/teams')
            }
        }

    );
});

module.exports = router;