const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

let token 
let decodedToken
const authenticate = async function(req,res,next){
    try{
         token = req.headers["x-api-key"]
        if(!token) return res.status(401).send({msg: "token must be present"})

         decodedToken = jwt.verify(token, "this is secret")
        if(!decodedToken) return res.status().send({msg: "invalid token"})

        next()

    }
    catch(error){
        res.status(500).send({status: false, error: error.message})
    }
}

const authorise = async function(req,res,next){
    try{
        let blogId = req.params.blogId
        if(blogId.length==24) {
            let data = await blogModel.findById(blogId)
            if(!data==null) return res.status(404).send({msg: "no blog available with this blogId"})
            let loggedInAuthor = data.authorId.toString()  //person who has token
            let privilagedAuthor = decodedToken.authorId  //person who is logedin (has token)

            if(loggedInAuthor != privilagedAuthor) return res.status(400).send({msg: "u r not authorised for this"})

            next()

        }

    }
    catch(error){
        res.status(500).send({status: false, error: error.message})
    }
}

const authoriseForDelete = async function(req,res,next){
    try{
        let token = req.headers["x-api-key"]
        if(!token) return res.status(400).send({msg: "token must be present in the header"})

        decodedToken = jwt.verify(token, "this is secret")
        if(!decodedToken) return res.status(400).send({msg: "token is invalid"})

        let privilagedAuthor = decodedToken.authorId
        let data = req.query

        // length of data is must be greater zero
       if (Object.keys(data).length==0) return res.status(400).send({msg: "plz enter the filer for deletion"})

       const {catagory, authorId, tags, subCatagory, isPublished} = data
       let mainData = {}

       if(catagory) {mainData.catagory= catagory}
       if(subCatagory) {mainData.subCatagory= subCatagory}
       if(tags) {mainData.tags= tags}
       if(authorId) {mainData.authorId= authorId}
       if(isPublished) {mainData.isPublished= isPublished}

       //must be assign at least one item in the mainData
       if(Object.keys(mainData).length==0) return res.status(400).send({msg: "plz enter a valid keys"})

       mainData.isPublished = true
       mainData.isDeleted= false

       let result = await blogModel.findOne(mainData)
       if(result==null) return  res.status(400).send({msg: "no data found to be deleted"})

       let id = result.authorId.toString()
       if(privilagedAuthor != id) return res.status(400).send({msg: "you are not authorised to do this operation"})

       next()

    }

    catch(error){
        res.status(500).send({ status:false, msg: error.message})
    }

    

}





module.exports.authenticate = authenticate
module.exports.authorise = authorise
module.exports.authoriseForDelete = authoriseForDelete