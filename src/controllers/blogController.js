const { findById, findOne } = require("../models/blogModel")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")
const authorModel = require("../models/authorModel")
const ObjectId = mongoose.Schema.Types.ObjectId

const createBlog = async function (req, res) {
    try {
        let data = req.body

        let authorId = req.body.authorId
        let isValid = mongoose.Types.ObjectId.isValid(authorId)
        // console.log(authorId)

        if (isValid == false) return res.send({ msg: "authorId is not valid" })

        let result = await authorModel.findById({ _id: authorId })
        if (!result) return res.status(400).send({ msg: "no author exist with this authorId" })
        if(data.isPublished || data.isDeleted==true){
            data.publishedAt = Date.now()
            data.deletedAt = Date.now()
        }


        let savedData = await blogModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//===============================================================================


const getBlog = async function (req, res) {
    try {
        let data = req.query
        const { catagory, subCatagory, tags, authorId } = data

        if (catagory) {
            let verifyCatagory = await blogModel.find({ catagory: catagory })
            if (!verifyCatagory) {
                return res.status(400).send("no blog exaist with this catagory")
            }
        }

        if (subCatagory) {
            let verifysubcatagory = await blogModel.find({ subCatagory: subCatagory })
            if (!verifysubcatagory) {
                return res.status(400).send("no blog exist with this subCatagory")
            }
        }

        if (tags) {
            let verifytags = await blogModel.find({ taga: tags })
            if (!verifytags) {
                return res.status(400).send("no blog with this tags exist")
            }
        }

        if (authorId) {
            let verifyauthorId = await blogModel.find({ authorId: authorId })
            if (!verifyauthorId) {
                res.status(400).send("no blog exist with this authorId")
            }
        }
        
        if(Object.keys(data).length==0) return res.status(404).send({status:false,msg:"data not found"})

         data.isDeleted =false
         data.isPublished =true

         console.log(data)

         let specificBlogs = await blogModel.find(data)

         if(specificBlogs.length==0){
            return res.status(400).send({status: false, data: specificBlogs})
         }
         else{
            console.log(specificBlogs.length)
            return res.status(200).send({status: true, data: specificBlogs})
         }

        }

    catch (error) {
             res.status(500).send({ sataus: false, error: error.message })
        }
}
//=======================================================================================
    
const updateBlog = async function(req,res){
    try{
        let data = req.body
        let blogId = req.params.blogId

        let user = await blogModel.findById({_id: blogId })
        

        if(!user || user.isDeleted==true){
            return res.status(400).send({status: false, msg: "no such user exist eith this blogId"})
        }
       

        let confirm = await blogModel.findOneAndUpdate({_id: blogId},{$set:{isPublished: true, publishedAt: Date.now()}} , {$push : {tags: data.tags, subCatagory: data.subCatagory} }, {new: true , upsert: true})
        console.log(data.tags)

        res.status(200).send({status: true, msg: confirm})
    }

    catch(error){
        res.status(500).send({status: false, error: error.message })

    }

}

//===============================================================================

const deleteBlog = async function(req,res){

    try{
        let blogId = req.params.blogId

        let blog = await blogModel.findOne({_id: blogId})
        
        if(! blog) return res.status(404).send({status: false, msg: "no blog exist with this blogId"})

        let data = blog.isDeleted

        if(data == true) return res.status(400).send({status: false, msg: "no blog exist"})
        res.status(200).send({status: true, msg: "data has been deleted"})
        
    }
    catch(error){
    res.status(500).send()
}
}

const deleteByQuery = async function(req,res){
    try{
        let data = req.query
        const deleteData = await blogModel.updateMany(data,{isDeleted: true}, {new: true})
        if(deleteData.matchedCount==0) return res.status(404).send({status:false, msg: "no data is found"})

        res.status(200).send({status: true, msg: "data is succesfuly deleted by query"})
    }
    catch(error){
        res.status(500).send({status: false, msg: error.message})
    }
}





// module.exports.createBlog = createBlog
// module.exports.getBlog = getBlog
// module.exports.updateBlog = updateBlog
// module.exports.deleteBlog = deleteBlog
// module.exports.deleteByQuery = deleteByQuery

module.exports = {createBlog, getBlog, updateBlog, deleteBlog, deleteByQuery}





