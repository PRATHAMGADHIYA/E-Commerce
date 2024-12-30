const express=require("express");
const { createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
} = require("../controller/productctrl");
const {authMiddleware,isAdmin}=require("../middlewares/authMiddleware")

const router=express.Router();


router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/:id",getProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct)
router.delete("/:id",authMiddleware,isAdmin,deleteProduct)
router.get("/",getAllProduct)
module.exports=router;