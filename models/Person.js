// @ Description : 
 // All the database schema kind of stuff designed here     
    const mongoose = require ('mongoose');
    const Schema = mongoose.Schema ;

    const PersonSchema =  new Schema ({  // person Data Base model 
      name: {
           type: String ,
           required : true 
        },
      email: {
        type: String ,
        required : true 
       },
       password: {
            type: String,
            required : true
       },
       username :{
         type : String,
          //required: true
       },
      profilepic :{
       type : String,
       default : "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png"
     },
      Date:{
       type: Date,
       default : Date.now
      }   
    });

   //  These can be change / modify in feture on needs

module.exports = Persons = mongoose.model("myPerson" , PersonSchema); // exporting person with mongoose 
