// const axios = require('axios')
const inputTask = document.getElementById('todoText');
const taskContainer = document.querySelector('.list-items');

async function updateTask(){
    try{
        const response = await fetch('http://127.0.0.1:5000/api/V1/tasks')
        const data = await response.json();
        const tasks = data.task
        taskContainer.innerHTML="";
        tasks.forEach((task)=>{
            appendTask(task.name, task._id, task.completed, taskContainer)
        })
    } catch(error){
        console.log(error)
    }
}

updateTask()


function appendTask(name, id, status, position) {
  let source = status ? "/images/crossout.png" : "/images/checkbox.png" 
  const newTask = document.createElement('li');
  const todoItems = document.createElement('div');
  todoItems.textContent=name;
  todoItems.style.textDecoration = status ? 'line-through' : 'none'; 
  const todoElements=`
  <div>
  <img id="${id}" class="edit todo-controls" data-status = ${status} src=${source}>
  <img id="${id}" class="edit todo-controls" src="/images/pencil.png" />
  <img id="${id}" class="delete todo-controls" onclick="deleteToDoItems(this)" src="/images/trashcan.png" />
  </div>`;
    newTask.appendChild(todoItems);
    newTask.innerHTML += todoElements;
  
    const button = newTask.querySelector('.edit');
    button.addEventListener('click',(event)=>{
      
      const name = newTask.textContent; 
      const id = event.target.id; 
      const currentStatus = event.target.dataset.status;
      const newStatus = currentStatus === 'true' ? 'false' : 'true';
      event.target.dataset.status = newStatus;
      patchTask(name, id, newStatus);
    });
    
    const updateImg = newTask.querySelectorAll('.edit')[1];
    updateImg.addEventListener('click',()=>{
      makeListItemEditable(newTask);
    });
    position.appendChild(newTask);
    return newTask;
}
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
}

async function patchTask(name, id, status){
  const requestData = {
    name: name,
    completed: status
  };

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/V1/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      console.log('Data updated successfully!');
      updateTask()
    } else {
      console.error('Error updating data:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

async function createToDoItem() {
      const requestData={
          name: inputTask.value,
          completed: false
      }
      fetch('http://127.0.0.1:5000/api/V1/tasks',{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      }).then(response => {
          if (response.ok) {
            console.log('Data sent successfully!');
            return response.json();
          } else {
            console.error('Error sending data:', response.status);
          }
        }).then(data=>{
          appendTask(data.task.name, data.task._id, data.task.completed, taskContainer)
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
}
async function deleteToDoItems(btn){
    console.log(btn)
    fetch(`http://127.0.0.1:5000/api/V1/tasks/${btn.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      updateTask()
    } else {
      throw new Error('Error: ' + response.status);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

listenForEvents();
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
}