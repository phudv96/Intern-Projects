const express = require('express')
const app = express()
const tasks = require('./route/task')
const connectDB = require('./db/connect')
require('dotenv').config()

const port = 5000

app.use(express.static('./public'))  
app.use(express.json())
app.use('/api/v1/tasks', tasks)

// app.get('/', (req,res)=>{
//     res.sendFile(path.resolve(__dirname, './public'))
// })

// app.all('*', (req, res) => {
//     res.status(404).send('resource not found')
//   })

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(`Server is listening at port ${port}.....`)
    })
    }catch(error){
        console.log(error)
    }
}

start()