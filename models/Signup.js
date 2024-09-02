const mongoose=require('mongoose')
const schema=mongoose.Schema;
const signupschema=new schema({
      firstName:{
          type:String,
      },
     lastName:{
         type:String,
      },
    email:{
        type:String,
        required:true,
         unique:true,
    },
    password:{
        type:String,
    }


});
module.exports=mongoose.model('signup',signupschema)