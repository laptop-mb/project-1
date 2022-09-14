const authorModel = require("../models/authorModel")
const router = require("../routes/route")
const jwt = require("jsonwebtoken")


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let savedData = await authorModel.create(data)

        res.status(201).send({status: true, msg: savedData})
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
}


const login = async function (req,res){
    try{
        let emailId = req.body.email
        let password = req.body.password

        if(!emailId || !password){
            return res.status(400).send({status: false, msg: "emailId and password is must it should be present"})
        }

        
        let author = await authorModel.findOne({email: emailId}, {password: password})
    if(! author){
        return res.status(400).send({status: false, msg: "no such user exist with this emailId and password"})
    }

    let token = jwt.sign({authorId: author._id.toString(), name: "mona"}, "this is secret")

    res.setHeader("x-api-key", token)
    res.status(201).send({status: true , msg: token})

}
catch(error){
    res.status(500).send({status: false, msg: error.message})
}

}





module.exports.createAuthor = createAuthor
module.exports.login = login