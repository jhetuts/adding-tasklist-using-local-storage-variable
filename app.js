const inputTask = document.getElementById('input-task');
const taskList = document.getElementById('tasks');
const doneTaskBtn = document.getElementById('doneTaskBtn');
const doneTask = document.getElementById('doneTask');
const clearAllTaskBtn = document.getElementById('clearAllTaskBtn');
const filterTask = document.getElementById('filter');
const filterBtn = document.getElementById('filterBtn');
const createTaskBtn = document.getElementById('createTaskBtn');

loadEventListener();

function loadEventListener(){
    document.addEventListener('DOMContentLoaded', getTasks);
    inputTask.addEventListener('keypress', addTask);
    createTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', removeTask);
    doneTaskBtn.addEventListener('click', doneAllTask);
    clearAllTaskBtn.addEventListener('click', doneAllTask);
    filterTask.addEventListener('keyup', filterTasks);
    filterBtn.addEventListener('click', function(){
        let val;
        filterTask.classList.toggle('show');

        if(filterTask.classList.contains('show')){
            this.innerHTML = `<span class="glyphicon glyphicon-remove pull-right"></span>`;
        } else {
            this.innerHTML = `<span>Filter</span>`;
        }

        val = filterTask.value = "";
        filterTasks(val);
    });
}

function addTask(e){
    console.log(e);
    if(e.keyCode === 13 || e.type == 'click'){
        if(inputTask.value == ""){
            alert('Nothing entered!');
        } else {
            const li = `
                <li class="task-item">${inputTask.value}<span class="glyphicon glyphicon-remove pull-right"></span></li>
            `;
            taskList.innerHTML += li;

            storeTaskInLocalStorage(inputTask.value);
            inputTask.value = "";
        }
    }
    checkTaskCount();
}
function removeTask(e){
    if(e.target.classList.contains('glyphicon-remove')){
        if(confirm("Remove selected item?")){
            addToArchive(e.target.parentElement.firstChild.textContent);
            e.target.parentElement.remove();

            addTaskToArchiveFromLocalStorage(e.target.parentElement.firstChild.textContent);
            removeTaskFromLocalStorage(e.target.parentElement);
        }
    }
    checkTaskCount();
}

function doneAllTask(e){
    let itemsToArchive;
    if(confirm("Delete all items in this section?")){
        if(e.target.id == "doneTaskBtn"){
            while(taskList.firstChild){
                itemsToArchive = taskList.firstChild.textContent;
                itemsToArchive = itemsToArchive.replace(/^\s+/, '').replace(/\s+$/, '');
                if(itemsToArchive != ''){
                    addToArchive(itemsToArchive);
                    addTaskToArchiveFromLocalStorage(itemsToArchive);
                }
                taskList.removeChild(taskList.firstChild);
            }
            clearAllTaskFromLocalStorage('tasks');
        } else {
            while(doneTask.firstChild){
                doneTask.removeChild(doneTask.firstChild);
            }
            clearAllTaskFromLocalStorage('archives');
            
        }
        checkTaskCount();
        checkArchiveCount();
    }
}
function filterTasks(e){
    const text = filterTask.value;
    let taskLabel = document.querySelector('.message-response');
    let count = 0;
    let taskitems = document.querySelectorAll('.task-item');
    taskitems.forEach(function(task){
        const item = task.firstChild.textContent;

        if(item.toLowerCase().indexOf(text.toLowerCase()) != -1){
            task.style.display = "block";
            checkTaskCount();
        } else {
            task.style.display = "none";
        }
    });
    taskitems.forEach(function(e){
        if(e.style.display == "none") count++;
    });

    if(count == taskList.childElementCount){
        taskLabel.textContent = "No match found!";
    } else {
        taskLabel.textContent = "";
    }
}
function addToArchive(task){
    doneTask.innerHTML += `<li>${task}</li>`;
    checkTaskCount();
    checkArchiveCount();
}
function checkTaskCount(){
    if(taskList.childElementCount > 0){
        const label = document.querySelector(".filter-label");
        if(taskList.childElementCount < 2){
            label.textContent = "Task: ";
        } else {
            label.textContent = "Tasks: ";
        }
        doneTaskBtn.classList.add('show');
    } else {
        doneTaskBtn.classList.remove('show');
    }
}
function checkArchiveCount(){
    const archive = document.getElementById('archive');
    if(doneTask.childElementCount > 0){
        archive.classList.add('show');
        clearAllTaskBtn.classList.add('show');
    } else {
        archive.classList.remove('show');
        clearAllTaskBtn.classList.remove('show');
    }
}

// Local Storage functions

function getTasks(){
    let tasks;
    let archives;

    if(localStorage.getItem('tasks') == null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    if(localStorage.getItem('archives') == null){
        archives = [];
    } else {
        archives = JSON.parse(localStorage.getItem('archives'));
    }

    tasks.forEach(function(task){
        const li = `
            <li class="task-item">${task}<span class="glyphicon glyphicon-remove pull-right"></span></li>
        `;
        taskList.innerHTML += li;
    });

    archives.forEach(function(archive){
        const li = `<li>${archive}</li>`;
        doneTask.innerHTML += li;
    });

    checkTaskCount();
    checkArchiveCount();
}
function storeTaskInLocalStorage(task){
    let tasks;
    if(localStorage.getItem('tasks') == null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function removeTaskFromLocalStorage(taskItem){
    let tasks;
    if(localStorage.getItem('tasks') == null){
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function clearAllTaskFromLocalStorage(key){
    if(key){
        localStorage.removeItem(key);
    }
}
function addTaskToArchiveFromLocalStorage(toArchive){
    let archiveTasks;
    if(localStorage.getItem('archives') == null){
        archiveTasks = [];
    } else {
        archiveTasks = JSON.parse(localStorage.getItem('archives'));
    }

    archiveTasks.push(toArchive);
    localStorage.setItem('archives', JSON.stringify(archiveTasks));
}