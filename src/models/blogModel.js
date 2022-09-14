const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

// { title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string}, category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}


const blogSchema = new mongoose.Schema({
title: {type: String, required: true},
body: {type: String, required: true},
authorId: {type: ObjectId, required: true, ref: "author"},
tags: [String],
catagory: {type:String, required: true },
subcatagory: {type: [String] , required:true},
createdAt:{type: Date},
updatedAt:{type: Date},
deletedAt:{type: Date},
isDeleted: {type:Boolean, default: false},
publishedAt: {type:Date},
isPublished: {type:Boolean, default: false}

},{ timestamps:true})

module.exports = mongoose.model("project-1-Blog", blogSchema)
