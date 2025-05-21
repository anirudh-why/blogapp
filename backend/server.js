const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const mongoClient = require('mongodb').MongoClient;

// CORS Middleware
app.use(cors({
    origin: ["https://blogapp-trekease-yv5o.onrender.com", "https://blogapp.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

//app.options('*', cors()); // Handle preflight requests

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());

mongoClient.connect(process.env.DB_URL)
    .then(client => {
        const blogdb = client.db('blogdb');
        const usersCollection = blogdb.collection('usersCollection');
        const articlesCollection = blogdb.collection('articlesCollection');
        const authorsCollection = blogdb.collection('authorsCollection');
        app.set('usersCollection', usersCollection);
        app.set('articlesCollection', articlesCollection);
        app.set('authorsCollection', authorsCollection);
        // console.log('DB connection success');
    })
    .catch(err => console.log('Error occurred in DB connection', err));

const userApp = require('./APIs/user-api');
const adminApp = require('./APIs/admin-api');
const authorApp = require('./APIs/author-api');

app.use('/user-api', userApp);
app.use('/author-api', authorApp);
app.use('/admin-api', adminApp);

app.get((req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use((err, req, res, next) => {
    res.send({ message: "Error!!", payload: err });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Webserver working on port ${port}`));
