const mongoose = require("mongoose")

// { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }

const authorSchema = new mongoose.Schema({
fname : {type:String , required: true},
lname : {type:String , required: true},
title: {type:String , required: true , enum: ["Mr","Mrs","Miss"]}, 
email : {type: String, required: true, unique: true, match: [/^(?:[a-zA-Z]{3})\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]},
password : {type: String, required: true}

}, {timestamps: true})

module.exports = mongoose.model("project-1Author", authorSchema)




