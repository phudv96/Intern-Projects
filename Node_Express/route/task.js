const express = require('express');
const router = express.Router();
const {getAllTasks, 
    createTask, 
    getTask, 
    updateTask, 
    deleteTask} = require('../controller/task'); //importing functions from controller

router.route('/').get(getAllTasks).post(createTask); //specifying what to do when receiving GET and POST request at /
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);//same goes for /:id

module.exports = router