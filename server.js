
 // @Description:
 // Entery Point of the project //

const express = require ('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser'); // Using for middleware 
const passport = require ('passport');

// @ Bring all routes  

const auth = require('./routes/api/auth'); // Self explainatory routes no need mention the extention
const questions= require('./routes/api/questions');
const profile = require('./routes/api/profile');

const app = express();

// @ Middlware for body parser / express 

 app.use(bodyparser.urlencoded({extended:false})); 
 app.use(bodyparser.json()); // getting the body parser data in JSON format.

  // @ Mongo DB Configuration 

const db = require('./setup/myurl').mongoURL

   // @ Attemp  to connect to mongoDB database 
mongoose.connect(db,{ useNewUrlParser: true , useUnifiedTopology: true})
.then( ()=> console.log ("MongoDB Connected successfully "))
.catch(err => console.log (err))

//  Passport Middleware 
app.use (passport.initialize());

// Config for jwt staregies
require ("./strategies/jsonwtstrategy")(passport);

// @Route ---- GET / 
// @desc    ----  A route to home page
// @Access ----- PUBLIC

// Just for testing routes 
app.get('/',(req, res) =>{
      res.send("Hey there big stack ");
})

 //   @ Middleware for all Routes 

  app.use('/api/auth',auth); 
  app.use('/api/profile',profile);
  app.use('/api/questions',questions);

const port = process.env.PORT || 3000; // Assigning the port by giving preferences . //  to upload the project in Heroku

app.listen(port , () => {
     console.log(`App is running at port ${port}`);
})