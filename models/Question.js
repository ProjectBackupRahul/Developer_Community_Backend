const mongoose = require('mongoose');
const Schema = mongoose.Schema;

   const QuestionScheam = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "myPerson"      // getting the default id from people schema 
   },
     textone:{
          type:String,
            required: true
     },
     texttwo:{
        type:String,
          required: true
   },
     name: {
          type: String 
     },
     upvotes:[
         {
        user : {
            type : Schema.Types.ObjectId,
            ref : "myPerson"      // getting the default id from people schema 
       },
            } 
        ],
        answers:[
            {
                user : {
                    type : Schema.Types.ObjectId,
                    ref : "myPerson"      // getting the default id from people schema 
               },
                text:{
                     type: String,
                     required: true
                },
                 name:{
                      type: String
                 },
                  date:{
                       type : Date,
                       default: Date.now
                  }
            }
        ],
        date:{
            type : Date,
            default: Date.now
       }
   })

    module.exports = Question = mongoose.model("myQuestion", QuestionScheam);