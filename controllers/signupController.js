const Signup =require('../models/Signup')
const bcrypt = require('bcryptjs');
const signup =async(req,res)=>{
   
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await Signup.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newSignup = new Signup({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newSignup.save();

        // Send a success response
        res.status(200).json({ message: 'User signup successful' });
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Error while signing up in backend' });
    }
}

const getAllusers =async(req,res)=>{
    try{
    const users =await Signup.find();
   
    const usersWithSNo = users.map((Signup, index) => ({
        SNo: index + 1,
        ...Signup.toObject(),
        
      }));
      res.json(usersWithSNo);
    //   res.status(200).json(users)
    }catch(error){
      res.status(500).json({message:"something gone Wrong", error})
    }
}

const getuserbyid =async(req,res)=>{
    const {id} =req.params;
    try{
        const user = await Signup.findById(id);
        if(!user){
            return res.status(404).json({message:'usernot found'})
        }
        res.status(200).json(user)
    }
    catch(error){
        res.status(500).json({message:'internal server error',error})
        console.log(error)
    }
}
const updateUser =async(req,res)=>{
    const {id} =req.params;
    const {firstName,lastName,email,password} =req.body;
    try{
        const updateUser = await Signup.findByIdAndUpdate(id,{firstName,lastName,email,password},{new:true});
        if(!updateUser){
            return res.status(404).json({message:'usernot found'})
        }
        res.status(200).json({message:'user data updated successfully',user:updateUser})
    }
    catch(error){
        res.status(500).json({message:'internal server error',error})
    }
}

const deleteuser=async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteuser = await Signup.findByIdAndDelete(id);
        if(!deleteuser){
            return res.status(404).json({message:'usernot found'})
        }
        res.status(200).json({message:'user data deleted successfully'})
    }
    catch(error){
        res.status(500).json({message:'internal server error',error})
    }

}
module.exports={signup,getAllusers,getuserbyid,updateUser,deleteuser}