const jwt=require('jsonwebtoken')
require('dotenv').config()

function verifyToken(req,res,next){
    //get bearer token from headers of req
    const bearerToken=req.headers.authorization;
  //  console.log(bearerToken)
    //if bearer token not available
    if(!bearerToken){
        return res.send({message:"Unahorized access. Plz login to continue"})
    }
    //extract token from bearer token
    const token=bearerToken.split(' ')[1]
   // console.log(token)
    try{
        jwt.verify(token,process.env.SECRET_KEY)
        next()
    }catch(err){
        next(err)
    }
}


module.exports=verifyToken;