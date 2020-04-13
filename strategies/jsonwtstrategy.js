 // passport JWT login strategy 
  // payloaad and login to steategy 
  
  const JwtStrategy = require("passport-jwt").Strategy; 
  const ExtractJwt = require ('passport-jwt').ExtractJwt;
  const mongoose = require ('mongoose'); // Mongodb client to connect with mongodb .
  const passport = require ('passport');
  const Person = mongoose.model("myPerson");
  const myKey = require ('../setup/myurl').secrect;
  
   //  npm validator // validation 
  // @ Descption : implementin passport jwt API .
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
  opts.secretOrKey = myKey;

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {  
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
     //  Using passport jwt token to  chaek and login in a specific user profile login

module.exports = passport =>{
       passport.use(new JwtStrategy(opts ,(jwt_payload, done) =>{
           Person.findById(jwt_payload.id)   // Quiring the The person form mongoose 
           .then(person => {
                if (person){
                    return done (null, person)
                }
                return done (null, false);
           })
           .catch(err => console.log(err))
       }))
    }