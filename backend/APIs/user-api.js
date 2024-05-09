const exp=require('express')
const userApp=exp.Router();
const bcryptjs=require('bcryptjs')
const expressasynchandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const verifyToken=require('../Middlewares/verifyToken')

let usersCollection;
let articlesCollection;

userApp.use((req,res,next)=>{
    usersCollection=req.app.get('usersCollection')
    articlesCollection=req.app.get('articlesCollection')
    next()
})

//usercreation
userApp.post('/user',expressasynchandler(async(req,res)=>{
  const newUser=req.body
  const dbuser = await usersCollection.findOne({ username: newUser.username });
  //if user found in db
  if (dbuser !== null) {
    res.send({ message: "User existed" });
  } else {
    const hashedPassword=await bcryptjs.hash(newUser.password,6)
    newUser.password=hashedPassword
    await usersCollection.insertOne(newUser)
    res.send({message:"User created"});
}
}))
//userlogin
userApp.post('/login',expressasynchandler(async(req,res)=>{
  const userCred=req.body;
  const dbuser= await usersCollection.findOne({username:userCred.username})
  if(dbuser===null){
    res.send({message:"Invalid username"})
  }
  else{
    const status = await bcryptjs.compare(userCred.password,dbuser.password)
    if(status===false){
      res.send({message:"Invalid password"})
    }
    else
    {
      const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
      res.send({message:"login success",token:signedToken,user:dbuser})
    }
  }
}))
//get articles
userApp.get('/articles',verifyToken,expressasynchandler(async(req,res)=>{
  const articlesCollection=req.app.get('articlesCollection')
  let articlesList=await articlesCollection.find().toArray()
  res.send({message:"articles",payload:articlesList})
}))
//comments
userApp.post('/comment/:articleId',verifyToken,expressasynchandler(async(req,res)=>{
  const userComment=req.body
  const articleIdfromUrl=(+req.params.articleId);
  let result=await articlesCollection.updateOne({articleId:articleIdfromUrl},{$addToSet:{comments:userComment}})
  console.log(result)
  res.send({message:"Comment posted"})
}))


module.exports=userApp;