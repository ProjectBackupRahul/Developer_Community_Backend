
//  @ Description : All the DB schema using mongoose client for Profile and Person in this directiory   
//  Profile mongo Schema 
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 const ProfileSchema = new Schema ({
        user : {
             type : Schema.Types.ObjectId,
             ref : "myPerson"      // getting the default id from people schema 
        },
          username : {
               type:String,
               required: true,
               max: 50
          },
       website :{
               type: String
       },
        country : {
                type : String, 
        },
        languages :{
             type : [String],
              required: true ,
        },
         portfolio : {
              type: String
         },
         workrole :[
             { role :{
               type: String,
               required:true,
             },
               company:{
                    type: String ,
               },
                      country :{
                        type: String,
                      },
                      form:{
                          type : Date,
                          required: true,
                      },
                      to:{
                        type: Date
                      },
                      current: {
                        type: Boolean,
                        default: false
                      },
                      details: {
                         type: String
                      }
                     }
            ],
           social :{
                youtube :{
                 type: String,
                },
                 facebook:{
                   type:String
                 },
                  instagram: {
                    type: String
              }
           },
              date :{
                    type: Date, 
                    default: Date.now
              }      
 });
 module.exports = Profile = mongoose.model("myProfile",ProfileSchema ); // exporting the myprofile schema with mongoose schema