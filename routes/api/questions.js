const express = require ("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require ('passport');

//  @ Importing the mongoDb(person) models
const Person = require ("../../models/Person");

//  @ Importing the mongoDb(profile) models 
const Profile = require ("../../models/Profile");

//  @ Importing the mongoDb(question) models 
const Question = require ("../../models/Question");

 
   // @ Type   GET
   // @ route  /api/question/
   // @ des     route for submitting question
   // @ Access  PUBLIc
    router.get("/", (req,res) =>{
         Question.find()
         .sort({date: 'desc'}) //  sorting in desending order 
         .then(question => res.json(question))
         .catch(err => res.json({noquestion: "No question to Display"}));
    })

   // @ Type   POST
   // @ route  /api/question/
   // @ des     route for submitting question
   // @ Access  PRIVATE

   router.post('/', passport.authenticate('jwt', {session:false}),(req,res) =>{
         const newQuestion = new Question ({
             textone: req.body.textone,
             texttwo: req.body.texttwo,
             user: req.user.id,
             name: req.body.name   
         });

            newQuestion.save()
           .then(question => res.json(question))
           .catch(err => console.log ("unable to push quetion to database " + err))
   });

   // @ Type   POST
   // @ route  /api/answers/:id
   // @ des     route for submitting answere to question
   // @ Access  PRIVATE

      router.post('/answeres/:id', passport.authenticate('jwt', {session:false }), (res,req) =>{
          Question.findById(req.params.id)
          .then(question =>{
             const newAnswer = {
                  user : req.user.id,
                  name : req.body.name ,
                  text : req.body.text,   
             };
               question.answers.unshif({newAnswer});
               question.save()
               .then(question => res.json(question))
               .catch(err => console.log (err) )
          })
          .catch(err => console.log(err))
      })

   // @ Type   POST
   // @ route  /api/upvote/:id
   // @ des     route for submitting answere to question
   // @ Access  PRIVATE

     router.post('upvote/:id', passport.authenticate('jwt', {session:false}), (req,res) =>{
          Profile.findOne({user: req.user.id})
          .then (Profile =>{
               Question.findById(req.params.id)
               .then(question =>{
                     if(question.upvotes.filter(upvotes =>{
                          upvotes.user.toString() === req.user.id.toString()}).length > 0){
                          return res.status(400).json({noupvote :"user already upvoted"})
                     }
                      question.upvotes.unshif({user: req.user.id})
                      .save() 
                      .then(question => {
                           res.json(question)
                      })
                      .catch(err => console.log(err))
               })
               .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
     })

 module.exports = router;