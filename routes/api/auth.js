// @ Description : REST API to accessed by the public .

const express = require ("express");
const router = express.Router();  // this router comes as default with express
                                  // using this becasuse we are not using any traditional app.GET / app.POST and so on
const bcrypt = require ("bcrypt");  //  Hased passowrd to stored in Mongo DB
const jsonwt = require ('jsonwebtoken');
const passport = require ('passport');

const key = require ('../../setup/myurl') //  Accessing the secrect key

   // @ Type   GET
   // @ route  /api/auth
   // @ des    just for test
   // @ Access public 

router.get('/', (req, res) => {
    res.json({test: 'Auth is being tested'})
   });

    // @ Import Schema for person to register inside Auth

    const Person = require ("../../models/Person");

   // @ Type   POST
   // @ route  /api/auth/register
   // @ description   route for registration of users
   // @ Access   PUBLIC

   router.post ('/register', (req,res) => {
           Person.findOne ({email : req.body.email})
          .then(person => {
                 if (person){  // person is already regitered
                       return res.status(400).json({emailerror: 'Email is already registered in ournsystem' });
                 }
                   else  {
                      const newPerson = new Person({
                          name : req.body.name,
                          email: req.body.email,
                          password : req.body.password

                      });

                // @ Encrypting the password befor pushing to DB using bcrypt JS

                         bcrypt.genSalt(10, (err, salt) => { // Generating the salt
                            bcrypt.hash(newPerson.password, salt, (err, hash) => {
                              if (err) throw err;
                               newPerson.password = hash;
                               newPerson
                               .save()  // saveing the hased password in DB
                               .then (person => res.json(person))
                               .catch(err => console.log(err))
                          });
                      });
                   }
                })
          .catch(err => console.log (err));
   });

   // @ Type   POST
   // @ route  /api/auth/register
   // @ description   route for registration of users
   // @ Access   PUBLIC

   router.post('/login', (req,res) => {
       const email = req.body.email;
       const password = req.body.password; // password from the user

        //  person schema is going to querry to the DB
         Person.findOne({email})
         .then(person => {
             if (!person){   //  not found the person in db condition
                  return res.status(404).json({emailerror : 'user not found with this email'})
             }
              bcrypt.compare(password, person.password)
              .then(isCorrect => {
                        if (isCorrect){
                            //res.json({success: " user is able to login with successfully"})
                            const palyload = {
                                   id: person.id,
                                   name: person.name,
                                   email : person.email
                            }
                             jsonwt.sign(
                                 palyload,
                                 key.secrect,
                                 {expiresIn: 3600},
                                 (err, token ) =>{
                                      if (err) throw err;
                                       res.json({
                                              success: true,
                                              token: " Bearer "  +  token
                                         // Here generating the token for a perticuler user after login
                                       })
                                 }
                             )
                             //  use palyload jwtto login to specific user
                        }
                         else{
                             res.status(400).json({passworderror: "Password is not coorect "})
                         }
              })
              .catch(err => console.log (err))
                   // match password from the DB and along with the password encryption
         })
         .catch(err => console.log(err));
   });

   // @ Type   GET
   // @ route  /api/auth/profile
   // @ description   route to check profile
   // @ Access   PRIVATE
   // @ Note : making this route as private by using passport authentication.

   router.get('/profile', passport.authenticate('jwt', { session: false }),(req, res) => {
         //console.log(req);

         res.json({
             id: req.user.id,
             name: req.user.name,    //  getting all the data from the body parser
             email: req.user.email,
             profilepic: req.user.profilepic
         })
   });

    // Start from session 13

module.exports = router; // exporting enter router , that can be accessable by other module
