const exp=require('express')
const commonApp=exp.Router()
const jwt=require('jsonwebtoken')
const verifyToken=require('../Middlewares/verifyToken')
const expressasynchandler=require('express-async-handler')
require('dotenv').config()

let usersCollection;
let authorsCollection;

commonApp.use((req,res,next)=>{
    usersCollection=req.app.get('usersCollection')
    authorsCollection=req.app.get('authorsCollection')
    next()
})

// Verify token endpoint - validates JWT and returns current user/author data
commonApp.get('/verify-token', verifyToken, expressasynchandler(async(req,res)=>{
    try {
        // Extract token from authorization header
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        
        // Decode the token to get user information
        const decoded = jwt.decode(token);
        
        // Check if it's a user or author based on the token payload
        let user = null;
        let usertype = null;
        
        if (decoded.username) {
            // Try to find in users collection
            user = await usersCollection.findOne({username: decoded.username});
            if (user) {
                usertype = 'user';
            } else {
                // If not found in users, try authors
                user = await authorsCollection.findOne({username: decoded.username});
                if (user) {
                    usertype = 'author';
                }
            }
        } else if (decoded.authorname) {
            // Token has authorname, so it's an author
            user = await authorsCollection.findOne({username: decoded.authorname});
            if (user) {
                usertype = 'author';
            }
        }
        
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        
        // Remove password from response
        const {password, ...userWithoutPassword} = user;
        
        res.send({
            message: "Token valid",
            user: {
                username: user.username,
                email: user.email,
                usertype: usertype
            }
        });
    } catch(err) {
        res.status(401).send({message: "Invalid token", error: err.message});
    }
}))

module.exports=commonApp;