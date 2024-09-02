const express=require('express');
const router=express.Router();
const {signup,getAllusers,getuserbyid,updateUser,deleteuser} = require('../controllers/signupController')


router.post('/signup',signup);
router.get('/signup',getAllusers);
router.get('/signup/:id',getuserbyid);
router.put('/signup',updateUser);
router.delete('signup',deleteuser);

module.exports=router;