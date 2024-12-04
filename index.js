const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

app.get('/', (req, resp) => {
  resp.send(`Server is running on port - ${port} `);
});

// Endpoint 1. Add a Task to the Task List
// <http://localhost:3000/tasks/add?taskId=4&text=Review%20code&priority=1>

function addToList(list, task) {
  list.push(task);
  return list;
}

app.get('/tasks/add', (req, resp) => {
  let task = {
    taskId: parseInt(req.query.taskId),
    text: req.query.text,
    priority: parseInt(req.query.priority),
  };

  let newTaskList = addToList(tasks, task);
  resp.json({ tasks: newTaskList });
});

//Endpoint 2. Read All Tasks in the Task List
//<http://localhost:3000/tasks>

app.get('/tasks', (req, resp) => {
  resp.json({ tasks });
});

// Endpoint 3. Sort Tasks by Priority
// <http://localhost:3000/tasks/sort-by-priority>

function sortFun(obj1, obj2) {
  return obj1.priority - obj2.priority;
}
function sortByPriority(tasks) {
  return tasks.sort(sortFun);
}

app.get('/tasks/sort-by-priority', (req, resp) => {
  let tasksCopy = tasks.slice();
  let sortedTasks = sortByPriority(tasksCopy);
  resp.json({ tasks: sortedTasks });
});

// Endpoint 4. Edit Task Priority
// <http://localhost:3000/tasks/edit-priority?taskId=1&priority=1>
function editPriority(tasks, taskId, priority) {
  tasks.forEach((task) => {
    if (task.taskId === taskId) {
      task.priority = priority;
    } else {
      task.priority = task.priority;
    }
    return task;
  });
  return tasks;
}
app.get('/tasks/edit-priority', (req, resp) => {
  let taskId = parseInt(req.query.taskId);
  let priority = parseInt(req.query.priority);

  let updatedTasks = editPriority(tasks, taskId, priority);
  resp.json({ tasks: updatedTasks });
});

// Endpoint 5. Edit/Update Task Text
// <http://localhost:3000/tasks/edit-text?taskId=3&text=Update%20documentation>
function editTask(tasks, taskId, text) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
    }
  }
  return tasks;
}
app.get('/tasks/edit-text', (req, resp) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;

  let updatedTasks = editTask(tasks, taskId, text);
  resp.json({ tasks: updatedTasks });
});

// Endpoint 6. Delete a Task from the Task List
// <http://localhost:3000/tasks/delete?taskId=2

function deleteTask(tasks, taskId) {
  return tasks.filter((task) => task.taskId !== taskId);
}

app.get('/tasks/delete', (req, resp) => {
  let taskId = parseInt(req.query.taskId);
  let filteredTasks = deleteTask(tasks, taskId);

  resp.json({ tasks: filteredTasks });
});

// Endpoint 7. Filter Tasks by Priority
// <http://localhost:3000/tasks/filter-by-priority?priority=1>
function fitlerByPriority(tasks, priority) {
  return tasks.filter((task) => task.priority === priority);
}
app.get('/tasks/filter-by-priority', (req, resp) => {
  let priority = parseInt(req.query.priority);
  let filteredTasks = fitlerByPriority(tasks, priority);
  resp.json({ tasks: filteredTasks });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
