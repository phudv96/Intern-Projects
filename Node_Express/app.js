const express = require('express');
const app = express();
const tasks = require('./route/task');
const connectDB = require('./db/connect');
require('dotenv').config();//importing .env file used to hide password, but I have url below

const port = 5000;

app.use(express.static('./public'));//using express.static to load up static website file
app.use(express.json());//to parse request as json 
app.use('/api/v1/tasks', tasks);//specifying the tasks done at this url

const start = async () =>{//connect to MongoDB
    try{
        await connectDB(process.env.MONGO_URI)//MONGO_URI=mongodb+srv://hiep:Cfvip113@todolist.el6f55x.mongodb.net/
        app.listen(port, ()=>{
            console.log(`Server is listening at port ${port}.....`)
        });
    }
    catch(error){
        console.log(error);
    }
}

start();