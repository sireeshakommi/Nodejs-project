const mongoose=require('mongoose')

const connectdb =async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        }
    );
    console.log("connected to mongodb successfully");

    }catch(error){
        console.log("error connecting databse",error)
    }
};

module.exports=connectdb;