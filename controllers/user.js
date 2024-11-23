const User = require("../models/user");

const createUser = async(req,res)=>{
    try{
        const { name, email, phone, age } = req.body;
        const user = await User.create({name,email,phone,age});
        return res.status(200).json({
            success:true,
            message:"User created Successfully"

        })
    }catch{
        res.status(400).json({
            success:false,
            message:"Cannot create the User"
        })
    }
}
//getAllUsers Using Pagination
const getAllUsers = async(req,res)=>{
    try{
        const {page=1, limit=10}= req.query;

        const users = await User.find().skip((page-1)*limit).limit(Number(limit));

        const total = await User.countDocuments();

        res.status(200).json({
            users,
            success:true,
            currentpage:Number(page),
        })

    }catch(err){
        res.status(400).json({
            success:false,
            message:"Cannot fetch the data"
        })
    }
}
// getUserById 
const getUserById = async(req,res)=>{
    try{
        const {id} =req.params;

        const user =await  User.findById(id);

        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            user,
            success:true,     
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"Cannot fetch the data by id"
        })
    }
}

const deletebyID = async(req,res)=>{
    try{
        const {id} =req.params;

        const user =await  User.findByIdAndDelete(id);

        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            success:true,
            message:"User Deleted Succesfully"

        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"Cannot delete the user"
        })
    }
}
 const updateUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const { name, email, password } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { name, email, password },
        { new: true } 
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user); 
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
module.exports = {  
    createUser,
    getAllUsers,
    getUserById,
    deletebyID,
    updateUser
  };