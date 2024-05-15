const inputTask = document.getElementById('todoText');
const taskContainer = document.querySelector('.list-items');
const hosturl = window.location.hostname; // Get the current hostname
const port = window.location.port; // Get the current port

updateTask();
listenForEvents();

async function updateTask(){
  try{
    const response = await fetch(`http://${hosturl}:${port}/api/V1/tasks`);//fetching data from api
    const data = await response.json();
    const tasks = data.data.task;
    taskContainer.innerHTML="";
    tasks.forEach((task)=>{
      appendTask(task.name, task._id, task.completed, taskContainer);
    });
  } 
  catch(error){
    console.log(error);
  }
};

function appendTask(name, id, status, position){
  let source = status ? "./images/crossout.png" : "./images/checkbox.png"; //display corresponding image depending on completed status
  const newTask = document.createElement('li');

  const todoItems = document.createElement('div'); //print out the todo item
  todoItems.textContent=name; 
  todoItems.style.textDecoration = status ? 'line-through' : 'none'; //strike through the text depending on the completed status
  
  const todoElements=`
  <div>
  <img id="${id}" class="edit todo-controls" data-status = ${status} src=${source}>
  <img id="${id}" class="edit todo-controls" src="./images/pencil.png" />
  <img id="${id}" class="delete todo-controls" onclick="deleteToDoItems(this)" src="./images/trashcan.png" />
  </div>`;

  newTask.appendChild(todoItems);
  newTask.innerHTML += todoElements; //need to append todoItem first before using this syntax to add todoElements's html
  
  const button = newTask.querySelector('.edit'); //selecting the check status button
  button.addEventListener('click',(event)=>{ 
    const name = newTask.textContent; 
    const id = event.target.id; 
    const currentStatus = event.target.dataset.status;//fetch the "status" attribute from the button
    const newStatus = currentStatus === 'true' ? 'false' : 'true';//set it to false if true, set to true if false
    event.target.dataset.status = newStatus;//pass new status to the toDo item
    patchTask(name, id, newStatus);
  });
    
  const updateImg = newTask.querySelectorAll('.edit')[1];//select the 2nd element with edit class
  updateImg.addEventListener('click',()=>{
    makeListItemEditable(newTask);//pass clicked button's parent element (New Task) to work with later
  });
  position.appendChild(newTask);
  return newTask;
};

function makeListItemEditable(listItem) {
  const listItemText = listItem.firstChild.innerText;
  const listItemID = listItem.childNodes[2].childNodes[1].id;
  const inputField = document.createElement('input');

  inputField.value = listItemText;
  listItem.innerHTML = '';
  listItem.appendChild(inputField);
    
  inputField.addEventListener('keydown', (event)=>{
    if (event.key === 'Enter') {
      const updatedText = inputField.value;
      listItem.innerHTML='';
      listItem.replaceWith(appendTask(updatedText, listItemID, false,listItem));
      patchTask(updatedText, listItemID);
    }
  })
};

async function patchTask(name, id, status){
  const requestData = {
    name: name,
    completed: status
  };
  try{
    const response = await fetch(`http://${hosturl}:${port}/api/V1/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if(response.ok) {
      console.log('Data updated successfully!');
      updateTask();
    } 
    else{
      console.error('Error updating data:', response.status);
    }
  } 
  catch (error) {
    console.error('Error updating data:', error);
  }
};

async function createToDoItem() {
  const requestData={
    name: inputTask.value,
    completed: false
  }
  fetch(`http://${hosturl}:${port}/api/V1/tasks`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => {
    if (response.ok) {
      console.log('Data sent successfully!');
      return response.json();
    } 
    else {
      console.error('Error sending data:', response.status);
    }
  })
  .then(data=>{
    appendTask(data.data.task.name, data.data.task._id, data.data.task.completed, taskContainer);
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
};

async function deleteToDoItems(btn){
  fetch(`http://${hosturl}:${port}/api/V1/tasks/${btn.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      updateTask();
    } 
    else {
      throw new Error('Error: ' + response.status);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

function listenForEvents() {
  const enterImage = document.querySelector('img[src="./images/plus.png"]');
  enterImage.addEventListener('click', createToDoItem);
  const textBox = document.getElementById('todoText')
  textBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      createToDoItem();
      textBox.value = '';
    }
  });
};