const Task = require('../model/Task');

const getAllTasks = async (req,res)=>{
    try{
        const task = await Task.find({});//using mongoose find method to search all entries
        res.status(200).json({status: 'success', data: { task }});//printing out the task at localhost:5000/api/v1/tasks for convinient checking
    }
    catch (error){
        res.status(500).json({status: 'error', msg: 'Failed to get task', error: error});
    }
};

const createTask = async (req,res)=>{
    try{
        const task = await Task.create(req.body);
        res.status(201).json({status: 'success', data: { task }});
    }
    catch (error){
        res.status(500).json({status: 'error', msg: 'Failed to create task', error: error});
    }
};

const getTask = async (req, res)=>{
    try{ 
        const {id: taskID}= req.params;
        const task = await Task.findOne({_id:taskID});
        if (!task){
            return res.status(404).json({msg:`No task with id: ${taskID}`});
        }
        res.status(200).json({status: 'success', data: { task }});
    }
    catch(error){
        res.status(500).json({status: 'error', msg: `Failed to get ${taskID} task`, error: error});
    }
};

const updateTask = async (req,res)=>{
    try{
        const {id: taskID} = req.params;
        const {name, completed} = req.body;
        const task = await Task.findOneAndUpdate({_id:taskID}, 
                                                {name: name, completed: completed},
                                                {new: true, runValidation: true});
    
        if (!task){
            return res.status(404).json({msg:`No task with id: ${taskID}`});
        }
        res.status(200).json({status: 'success', data: { task }});
    }
    catch(error){
        res.status(500).json({status: 'error', msg: 'Failed to update task', error: error});
    }
};


const deleteTask = async (req,res)=>{
    try{
        const {id: taskID} = req.params;
        const task = await Task.findOneAndDelete({_id:taskID});
    
        if (!task){
        return res.status(404).json({msg:`No task with id: ${taskID}`});
        }
        res.status(200).json({status: 'success', data: { task }});
    }
    catch(error){
        res.status(500).json({status: 'error', msg: 'Failed to delete task', error: error});
    }
};

module.exports = {getAllTasks, 
    createTask, 
    getTask, 
    updateTask, 
    deleteTask};