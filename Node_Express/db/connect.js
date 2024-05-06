const mongoose = require('mongoose')

// const connectionString = 'mongodb+srv://hiep:Cfvip113@todolist.el6f55x.mongodb.net/'

const connectDB = (url)=>{
    return mongoose.connect(url)
}

module.exports = connectDB
