const express = require("express");
// const { Router } = require("express")
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const auth = require("../middleWare/auth")
const validator = require("../validators/validator")


router.get("/test-me",function(req,res){
    res.send("mona")
})

router.post("/createAuthor",validator.validate, authorController.createAuthor)

router.post("/createBlog",auth.authenticate,validator.blogValidator, blogController.createBlog)
router.get("/getBlog",auth.authenticate, blogController.getBlog)
router.put("/updateBlog/:blogId",auth.authenticate,auth.authorise, blogController.updateBlog)
router.delete("/deleteBlog/:blogId",auth.authenticate, auth.authorise, blogController.deleteBlog)
router.delete("/deleteByQuery",auth.authenticate,auth.authoriseForDelete, blogController.deleteByQuery)
router.post("/login", authorController.login)


module.exports =router


//doubt routeror express ki line
//routerka r capital
// project ka meaning