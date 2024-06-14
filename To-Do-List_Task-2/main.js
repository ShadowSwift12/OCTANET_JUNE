// Selectors
const toDoInput = document.querySelector('.todo-input');
const dateInput = document.querySelector('.date-input');
const priorityInput = document.getElementById('priority-input');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const subBtn = document.getElementById('sub');
const form = document.querySelector('form');
const dropdownContent = document.querySelector('.dropdown-content');

// Event Listeners
subBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
form.addEventListener('submit', function(event) {
    event.preventDefault();
    addTodo();
});
dropdownContent.addEventListener('click', function(event) {
    if (event.target.tagName === 'SPAN') {
        priorityInput.value = event.target.getAttribute('data-priority');
        document.querySelector('.todo-btn').innerText = event.target.innerText;
    }
});

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(localStorage.getItem('savedTheme'));

// Function to add todo
function addToDo(event) {
    // Prevents form from submitting / Prevents form from reloading
    event.preventDefault();
    addTodo();
}   

// Function to add todo
function addTodo() {
    // toDo DIV
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    
    // Create LI
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);
    
    // Add details DIV
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('todo-details');
    detailsDiv.innerHTML = `
        <span>Due: ${dateInput.value}</span>
        <span>Priority: ${priorityInput.value}</span>
    `;
    toDoDiv.appendChild(detailsDiv);
    
    // Add todo object to local storage
    const todoObject = {
        text: toDoInput.value,
        date: dateInput.value,
        priority: priorityInput.value
    };
    savelocal(todoObject);
    
    // check btn
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);
    
    // delete btn
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);
    
    // Append to list
    toDoList.appendChild(toDoDiv);
    
    // Clearing the input
    toDoInput.value = '';
    dateInput.value = '';
    priorityInput.value = '';
    document.querySelector('.todo-btn').innerText = 'Priority';
}

// Event listener for Enter key press
toDoInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        addTodo();
    }
});

function deletecheck(event){
    const item = event.target;
    
    // delete
    if(item.classList.contains('delete-btn')) {
        item.parentElement.classList.add("fall");
        
        // remove the item after the animation is done
        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        });
        // removing local todos
        removeLocalTodos(item.parentElement);
    }
    
    // check
    if(item.classList.contains('check-btn')) {
        item.parentElement.classList.toggle("completed");
    }
}

// Saving to local storage
function savelocal(todo){
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    todos.forEach(function(todo) {
        // toDo DIV
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);
        
        // Create LI
        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);
        
        // Add details DIV
        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('todo-details');
        detailsDiv.innerHTML = `
            <span><b>Due:</b> ${todo.date}</span>
            <span><b>Priority:</b> ${todo.priority}</span>
        `;
        toDoDiv.appendChild(detailsDiv);
        
        // check btn
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        
        // delete btn
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);
        
        // Append to list
        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo){
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    const todoText = todo.querySelector('.todo-item').innerText;
    todos = todos.filter(t => t.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');
    
    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');
    
    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
    // Change dropdown content color
    document.querySelector('.dropdown-content').className = `dropdown-content ${color}-dropdown-content`;
    document.querySelector('.date-input').className = `date-input ${color}-date-input`;
}