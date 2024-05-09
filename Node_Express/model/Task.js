const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({//creating the format for request received
    name: {
    type: String,
    required:[true, 'must provide name'],//making it so the name cannot be blank
    trim: true,
    }, 
    completed:Boolean,
})

module.exports = mongoose.model('Task',TaskSchema)