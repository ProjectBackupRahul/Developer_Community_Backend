const express = require ("express");
const router = express.Router();

const mongoose = require('mongoose');
const passport = require ('passport');

//  @ Importing the mongoDb(profile) models
const Person = require ("../../models/Person");

//  @ Importing the mongoDb(profile) models 

const Profile = require ("../../models/Profile");

   // @ Type   GETT
   // @ route  /api/profile/
   // @ des     route for personal user profile
   // @ Access  PRIVATE

    router.get('/', passport.authenticate('jwt', {session: false}), (req,res)=>{
             Profile.findOne({user: req.user.id})
             .then (profile =>{
                 if (!profile){
                 return res.status(404).json ({profilenotfound: 'user profile not found'})
                 }
                  res.json(profile);
             })
             .catch(err => console.log ('got some error in profilr' + err)) 
    });

   // @ Type   POST
   // @ route  /api/profile/
   // @ Description    route for user profile
   // @ Access   PRIVATE

    router.post('/', passport.authenticate('jwt', {session: false}),(req,res) =>{
              const ProfileValues = {};   
               ProfileValues.user = req.user.id;
               if (req.body.username) ProfileValues.username = req.body.username ;
               if (req.body.website) ProfileValues.website = req.body.website ;
               if (req.body.country) ProfileValues.country = req.body.country ;
               if (req.body.portfolio) ProfileValues.portfolio = req.body.portfolio ;
               if  (typeof req.body.languages !== undefined ){
                   ProfileValues.languages = req.body.languages.split(',')
               }
               // Get Social link 

                ProfileValues.social = {};
               if (req.body.youtube) ProfileValues.social.youtube = req.body.youtube ;
               if (req.body.facebook) ProfileValues.social.youtube = req.body.facebook ;
               if (req.body.instagram) ProfileValues.social.youtube = req.body.instagram ;

          //  Database Stuff
            Profile.findOne({ user: req.user.id})
            .then( profile => {
                      if (profile){
                             Profile.findOneAndUpdate(
                                  {user: req.user.id},
                                  {$set : ProfileValues},
                                  { new : true}
                             ).then (profile => res.json(profile))
                              .catch (err => console.log ("Problem in update" + err));
                      }
                        else {
                                Profile.findOne ({username : ProfileValues.username})
                                .then (profile => {

                                     //  Username already exists 
                                       if (profile){
                                              res.status(400).json({username : 'Username already exists' })
                                       }
                                         // Save user 
                                      new Profile(ProfileValues)
                                      .save()
                                      .then( profile => res.json(profile))
                                      .catch (err => console.log (err)) 
                                })
                                .catch (err => console.log (err));
                        }
            })
            .catch (err => console.log ("Problem in feching profile" + err) )
    });

   // @ Type    GET
   // @ Route   /api/profile/: Username 
   // @ Description     route for user profile
   // @ Access   PUBLIC

   router.get ('/:username', (req,res) =>{
       Profile.findOne({username : req.param.username})
       .populate('user', ["name" , "profilepic"])
       .then (profile => {
             if (!profile){
                    res.status(404).json({usernotfound: 'User not found '});
             }
               res.json(profile)
       })
       .catch (error => console.log ("Error in fetching username " + error))
   })

   // @ Type   GET
   // @ Route  /api/profile/find/ Everyone
   // @ Description     route for all user find from DB
   // @ Access   PUBLIC

   router.get ('/find/everyone', (req,res) =>{
    Profile.find({username : req.param.username}) // only find is for find all from DB collection
    .populate('user', ["name" , "profilepic"])
    .then (profiles => {
          if (!profiles){
                 res.status(404).json({usernotfound: ' No profile was found '});
          }
            res.json(profiles)
    })
    .catch (error => console.log ("Error in fetching username " + error))
 })

   // @ Type   DELETE
   // @ Route  /api/profile/find/ Everyone
   // @ Description     route for deleting user based on ID 
   // @ Access   PRIVATE
   // @ Authentication jwt authentication strategies for private route 

   router.delete('/',  passport.authenticate('jwt', {session: false}), (req,res) =>{
            Profile.findOne({user: req.user.id})
            Profile.findByIdAndRemove({user: req.user.id})
            .then (() => {
                 Person.findOneAndRemove({_id: req.user.id})
                 .then(() =>{
                      res.json({Success: "Delete success!"})
                 })
                 .catch(err => console.log(err))
            })
            .catch(err =>  console.log(err));
       });

   // @ Type   POST 
   // @ Route  /api/profile/mywork
   // @ Description     route for Adding workprofile of person
   // @ Access   PRIVATE
   // @ Authentication jwt authentication strategies for private route

   router.post('/workrole', passport.authenticate('jwt',{session: false}), (req,res) =>{
          Profile.findOne({user: req.user.id})
          .then( profile =>{
                 if (!profile){
                 res.status(404).json({usernotfound: ' No profile was found '});
                 }
                const newWork ={
                     role: req.body.role,
                     company : req.body.company,
                     country:req.body.country,
                     from:req.body.from,
                     to:req.body.to,
                     current:req.body.current,
                     details:req.body.details,
                };
                 profile.worklrole.unshift(newWork);
                 profile.save()
                 .then(profile => {
                        res.json(profile)
                 })
                 .catch(err => console.log(err))
          })
          .catch(err => console.log (err))
   })

   // @ Type   POST 
   // @ Route  /api/profile/workrole/:w_id
   // @ Description   route for specific workrole
   // @ Access   PRIVATE

 router.delete('/workrole/:w_id',passport.authenticate('jwt', {session: false}), (req,res) =>{
      Profile.findOne({user:req.user.id})
      .then(profile =>{
          if (!profile){
               res.status(404).json({usernotfound: ' No profile was found '});
               }
               const removethis = profile.worklrole.map(item => item.id)  // get all the id inside a array
               .indexOf(req.params.w_id);

               profile.worklrole.splice(removethis,1);
               profile.save()
               .then(profile =>{
                     res.json(profile);
               })
               .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
 })

 module.exports = router;