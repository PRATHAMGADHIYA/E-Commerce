
const asyncHandler = require("express-async-handler")
const Product = require("../models/product.model")
const slugify = require("slugify")

const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error)
    }
});

const updateProduct=asyncHandler(async (req, res) => {
    const id=req.params;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);

        }
        const updatedProduct = await Product.findOneAndUpdate({id}, req.body, {new: true});
        res.json(updatedProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});


const deleteProduct=asyncHandler(async (req, res) => {
    const id=req.params;
    try{
        const deleteProduct = await Product.findOneAndDelete(id);
        res.json(deleteProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const getProduct=asyncHandler(async (req, res) => {
    const {id}=req.params;
  try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct=asyncHandler(async (req, res) => {
    try {
        // filtering
        const queryObj={...req.query};
        const excludeFields=["page","sort","limit","fields"];
       excludeFields.forEach(field => delete queryObj[field]);
       
       let queryStr=JSON.stringify(queryObj);
       queryStr=queryStr.replace(/\b(gte|gt|lt|lte)\b/g,match => `$${match}`);
       
       let query=Product.find(JSON.parse(queryStr));

       //sorting
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(" ");
            query=query.sort(sortBy);
        }else{
            query=query.sort("-createdAt")
        }

        //limiting the fields

        if(req.query.fields){
            const fields=req.query.fields.split(',').join(" ");
            query=query.select(fields);
        }else{
            query=query.select("-__v")
        }

        // pagination

        const page=req.query.page;
        const limit=req.query.limit;
        const skip=(page-1)*limit;
        query=query.skip(skip).limit(limit)
        if(req.qquery.page){
            const productCount=await Product.countDocuments();
            if(skip>=productCount)throw new Error("This page does not exists ")
        }
        console.log(page,limit,skip);
        

       const product=await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
}); 

module.exports = { createProduct,getProduct,getAllProduct,updateProduct,deleteProduct }