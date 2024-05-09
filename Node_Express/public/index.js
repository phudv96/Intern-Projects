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
            // console.log(task._id)
            appendTask(task.name, task._id, taskContainer)
        })
    } catch(error){
        console.log(error)
    }
}

updateTask()

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
          // Handle error response
        }
      }).then(data=>{
        appendTask(data.task.name, data.task._id, taskContainer)
      })
      .catch(error => {
        console.error('Error sending data:', error);
        // Handle network or other errors
      });
}

function appendTask(name, id, position) {
    const newTask = document.createElement('li');
    const todoItems = `<div title="Hit Double Click and Complete" ondblclick="completedToDoItems(this)">
                        ${name}
                      </div>
                      <div>
                        <img id="${id}" class="edit todo-controls" src="/images/pencil.png" />
                        <img id="${id}" class="delete todo-controls" onclick="deleteToDoItems(this)" src="/images/trashcan.png" />
                      </div>`;
    newTask.innerHTML = todoItems;
  
    const updateImg = newTask.querySelector('.edit');
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
        listItem.replaceWith(appendTask(updatedText, listItemID, listItem));
        
      }
    })
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