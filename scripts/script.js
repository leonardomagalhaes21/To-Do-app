var removedTasks = [];
var clearedTasks = [];
var taskList = document.getElementById("list");
var lastOperationWasClearAll = false;

window.onload = function() {
    var storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        for (var i = 0; i < storedTasks.length; i++) {
            addTask(storedTasks[i]);
        }
    }
}

function addTask(taskText) {
    var taskInput = document.getElementById("input");

    var text = taskText || taskInput.value;

    if (text !== "") {
        var newTask = document.createElement("li");
        newTask.textContent = text;

        var removeButton = document.createElement("button");
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
    var tasks = [];
    for (var i = 0; i < taskList.children.length; i++) {
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
            var lastClearedTask = clearedTasks.pop();
            taskList.insertBefore(lastClearedTask.task, lastClearedTask.nextSibling);
        }
        lastOperationWasClearAll = false;
    } else if (removedTasks.length > 0) {
        var lastRemovedTask = removedTasks.pop();
        taskList.insertBefore(lastRemovedTask.task, lastRemovedTask.nextSibling);
    }
}

var undoButton = document.getElementById("undo");
undoButton.onclick = undo;

var addButton = document.getElementById("add");
addButton.addEventListener('click', function() {
    addTask();
});

var clearButton = document.getElementById("clear");
clearButton.onclick = clearAll;