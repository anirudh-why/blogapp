const exp=require('express')
const app=exp()
require('dotenv').config() //process.env.PORT
const mongoClient=require('mongodb').MongoClient;
const path=require('path')

//deploy build
app.use(exp.static(path.join(__dirname,'../client/build')))
app.use(exp.json())

mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //db object
    const blogdb=client.db('blogdb')
    //get collection object
    const usersCollection=blogdb.collection('usersCollection')
    const articlesCollection=blogdb.collection('articlesCollection')
    const authorsCollection=blogdb.collection('authorsCollection')
    //share coll obj with app
    app.set('usersCollection',usersCollection)
    app.set('articlesCollection',articlesCollection)
    app.set('authorsCollection',authorsCollection)
    console.log('db connection success')

})
.catch(err=>console.log('error occered in db connection',err))

const userApp=require('./APIs/user-api')
const adminApp=require('./APIs/admin-api')
const authorApp=require('./APIs/author-api')

app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)
//for refresh
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})

app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err})
})

const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`Webserver working on port ${port}`))