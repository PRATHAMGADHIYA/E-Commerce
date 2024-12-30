const express= require("express");
const { createuser, 
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
} = require("../controller/userctrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router=express.Router();
router.post("/register",createuser)
router.put("/password",authMiddleware,updatePassword)
router.post("/login",loginUserCtrl)
router.get("/all-users",getAllUser)
router.get("/logout",logout)
router.get("/:id",authMiddleware,isAdmin,getUser)
router.delete("/:id",deleteUser)
router.put("/edit-user",authMiddleware,updateUser)
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser)
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser)
router.put("/refresh",handleRefreshToken)

module.exports=router; 