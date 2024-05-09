const exp=require('express')
const authorApp=exp.Router();
const bcryptjs=require('bcryptjs')
const expressasynchandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const verifyToken=require('../Middlewares/verifyToken')

let authorsCollection;
let articlesCollection;

authorApp.use((req,res,next)=>{
    authorsCollection=req.app.get('authorsCollection')
    articlesCollection=req.app.get('articlesCollection')
    next()
})

authorApp.post('/author',expressasynchandler(async(req,res)=>{    
    const newAuthor=req.body
    //console.log(newAuthor);
    const dbauthor=await authorsCollection.findOne({ username: newAuthor.username })
    if(dbauthor!==null){
        res.send({message:"Author Existed"});
    }
    else{
        const hashedPassword=await bcryptjs.hash(newAuthor.password,6)
        newAuthor.password=hashedPassword
        await authorsCollection.insertOne(newAuthor)
        res.send({message:"Author created"});
    }
}))


authorApp.post('/login',expressasynchandler(async(req,res)=>{
    const authorCred=req.body;
    console.log(authorCred);
    const dbauthor= await authorsCollection.findOne({username:authorCred.username})
    if(dbauthor===null){
      res.send({message:"Invalid authorname"}) 
    }
    else{
      const status = await bcryptjs.compare(authorCred.password,dbauthor.password)
      if(status===false){
        res.send({message:"Invalid password"})
      }
      else
      {
        const signedToken=jwt.sign({authorname:dbauthor.authorname},process.env.SECRET_KEY,{expiresIn:'1d'})
        res.send({message:"login success",token:signedToken,user:dbauthor})
      }
    }
}))

authorApp.post('/articles',verifyToken,expressasynchandler(async(req,res)=>{
  const newArticle=req.body
  await articlesCollection.insertOne(newArticle)
  res.send({message:"New article created"})
}))
//modify article
authorApp.put('/articles',verifyToken,expressasynchandler(async(req,res)=>{
  const modifiedArticle=req.body
  let result=await articlesCollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
  //console.log(result)
  let latestArticle=await articlesCollection.findOne({articleId:modifiedArticle.articleId})
  res.send({message:"Article Modified",article:latestArticle})
}))
//soft delete
/*
authorApp.put('/articles/:articleId',verifyToken,expressasynchandler(async(req,res)=>{
  const articleidfromurl=req.params.articleId
  const articletodelete=req.body
  await articlesCollection.updateOne({articleId:articleidfromurl},{$set:{...articletodelete,status:false}})
  let latestArticle=await articlesCollection.findOne({articleId:articleidfromurl})
  res.send({message:"article removed",article:latestArticle})
}))*/
//delete and restore
authorApp.put('/articles/:articleId',verifyToken,expressasynchandler(async(req,res)=>{
  //get articleId from url
  const artileIdFromUrl=(+req.params.articleId);
  //get article 
  const articleToDelete=req.body;

  if(articleToDelete.status===true){
     let modifiedArt= await articlesCollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:"after"})
     res.send({message:"article deleted",payload:modifiedArt.status})
  }
  if(articleToDelete.status===false){
      let modifiedArt= await articlesCollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:"after"})
      res.send({message:"article restored",payload:modifiedArt.status})
  }
 
 
}))
//read articles
authorApp.get('/articles/:username',verifyToken,expressasynchandler(async(req,res)=>{
  const authorName=req.params.username
  const articlesList=await articlesCollection.find({status:true,username:authorName}).toArray()
  res.send({message:"List of articles",payload:articlesList})
}))

module.exports=authorApp;