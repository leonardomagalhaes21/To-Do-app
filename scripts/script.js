let removedTasks = [];
let clearedTasks = [];
let taskList = document.getElementById("list");
let lastOperationWasClearAll = false;

window.onload = function() {
    let storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        for (let i = 0; i < storedTasks.length; i++) {
            addTask(storedTasks[i]);
        }
    }
}

function addTask(taskText) {
    let taskInput = document.getElementById("input");

    let text = taskText || taskInput.value;

    if (text !== "") {
        let newTask = document.createElement("li");
        newTask.textContent = text;

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.onclick = function() {
            removedTasks.push({ task: newTask, nextSibling: newTask.nextSibling });
            taskList.removeChild(newTask);
            lastOperationWasClearAll = false;
            saveTasks();
        };

        newTask.appendChild(removeButton);

        taskList.appendChild(newTask);

        if (!taskText) {
            taskInput.value = "";
        }
    }
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    for (let i = 0; i < taskList.children.length; i++) {
        tasks.push(taskList.children[i].textContent.replace('Remove', ''));
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearAll() {
    while (taskList.firstChild) {
        clearedTasks.push({ task: taskList.firstChild, nextSibling: taskList.firstChild.nextSibling });
        taskList.removeChild(taskList.firstChild);
    }
    removedTasks = [];
    lastOperationWasClearAll = true;
    saveTasks();
}

function undo() {
    if (lastOperationWasClearAll) {
        while (clearedTasks.length > 0) {
            let lastClearedTask = clearedTasks.pop();
            taskList.insertBefore(lastClearedTask.task, lastClearedTask.nextSibling);
        }
        lastOperationWasClearAll = false;
    } else if (removedTasks.length > 0) {
        let lastRemovedTask = removedTasks.pop();
        taskList.insertBefore(lastRemovedTask.task, lastRemovedTask.nextSibling);
    }
}

let undoButton = document.getElementById("undo");
undoButton.onclick = undo;

let addButton = document.getElementById("add");
addButton.addEventListener('click', function() {
    addTask();
});

let clearButton = document.getElementById("clear");
clearButton.onclick = clearAll;
