const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const validatemongodbid = require("../utils/validatemongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt=require("jsonwebtoken");


//create User

const createuser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const finduser = await User.findOne({ email: email });
    if (!finduser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User already Exists")
    }
});


//login user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        },
         { new: true }
        );
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000,
        })
        res.json({
            id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Password")
    }
});
// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies=req.cookies;
    console.log(cookies);
    
    if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookies.refreshToken;
    console.log(refreshToken);
    const user=await User.findOne({refreshToken});
    if (!user) throw new Error("no refresh token present in db or not matched");
    
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !== decoded.id){
            throw new Error("there is something wrong with refresh token")
        }
       const accessToken= generateToken(user?._id)
       res.json(accessToken)
    })
});


//logout funtonality
const logout=asyncHandler(async(req,res)=>{
    const cookies=req.cookies;
    console.log(cookies);
    
    if (!cookies?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookies.refreshToken;
    console.log(refreshToken);
    const user=await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{ 
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken,{  
        refreshToken: "",
    }),
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
    res.sendStatus(204);
});
//update User
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validatemongodbid(_id);

    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            emai: req?.body?.email,
            mobile: req?.body?.mobile,
        }, {
            new: true
        })
        res.json(updateUser)
    } catch (error) {
        throw new Error(error)
    }
})

//get all User
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
});

//get a single User

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validatemongodbid({id});

    try {
        const getUser = await User.findById(id);
        res.json({ getUser })
    } catch (error) {
        throw new Error(error);
    }
});

//delete a User


const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({ deleteUser })
    } catch (error) {
        throw new Error(error);
    }
});


const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validatemongodbid(id);

    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        },{
            new: true,
        });
        res.json(block);
    } catch (error) {
        throw new Error(error);
    }
});
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validatemongodbid(id);

    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true,
        });
        res.json({ message: "User Unblocked" })
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword=asyncHandler(async (req, res) => {
    const { _id}=req.user;
    const {password}=req.body;
    validatemongodbid(_id);
    const user =await User.findById(_id);
    if(password){
        user.password=password;
        const updatePassword=await user.save();
        res.json(updatePassword)
    }
    else{
        res.json(user);
    }
});
module.exports = {
    createuser,
    loginUserCtrl,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword
}