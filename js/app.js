const months = [
  "January",
  "Fubruary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Dicember",
];
let lang = navigator.language;
let d = new Date();
let dayname = d.toLocaleString(lang, { weekday: "long" });
let date = d.getDate();
let month = months[d.getMonth()];
document.querySelector(".date").innerHTML = `${dayname} , ${date}th`;
document.querySelector(".month").innerHTML = month;

const taskinput = document.querySelector(".task-input");
const tasklistContainer = document.querySelector(".task-list-container");
const clearAll = document.querySelector(".clear-task-btn");
const filters = document.querySelectorAll(".task-menu-container span");
let todos = JSON.parse(localStorage.getItem("todo-list"));
let isUpdate = false;
let UpdateId;

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `   <li class="task">
        <label for="${id}">
            <input onclick = "updateStatus(this)" type="checkbox" id="${id}">
            <p ${isCompleted}>${todo.name}</p>
        </label>
    
            <i onclick = "showMenu(this)" class="ri-more-fill dot-btn"></i>
            <ul class="task-menu ">
                <li onclick = "editeTask(${id},'${todo.name}')"><i class="ri-pencil-fill edit-btn"></i> Edite</li>
        <li onclick = "deleteTask(${id})"><i class="ri-delete-bin-7-fill delete-btn"></i>Delete</li>
            </ul>
        
    </li>`;
      }
    });
  }

  tasklistContainer.innerHTML =
    li ||
    ` <span><i class="ri-clipboard-fill"></i></span>
    <span class="timetoday"></span>
   <span class="no-task-message">No task here yet</span>`
   
}
showTodo("all");
function showMenu(selectedTask) {
  let taskMenu = selectedTask.nextElementSibling;
  console.log(taskMenu);
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
function editeTask(taskId, taskName) {
  isUpdate = true;
  UpdateId = taskId;
  taskinput.value = taskName;
  taskinput.focus();
}
function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}
clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
  let divlist = document.querySelectorAll(".task").length;
  document.querySelector(".number-of-task").innerHTML = `Task ${divlist}`;
  showTime()
});
taskinput.addEventListener("keyup", (e) => {
  let userTask = taskinput.value;
  if (e.key == "Enter" && userTask) {
    let divlist = document.querySelectorAll(".task").length;
    document.querySelector(".number-of-task").innerHTML = `Task ${divlist}`;
    if (!isUpdate) {
      if (!todos) {
        todos = [];
      }
      let userInfo = { name: userTask, status: "pending" };
      todos.push(userInfo);
    } else {
      isUpdate = false;
      todos[UpdateId].name = userTask;
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));
    taskinput.value = "";
    showTodo("all");
  }
  let divlist = document.querySelectorAll(".task").length;
  document.querySelector(".number-of-task").innerHTML = `Task ${divlist}`;
});
let divlist = document.querySelectorAll(".task").length;
document.querySelector(".number-of-task").innerHTML = `Task ${divlist}`;

let currentTime = document.querySelector(".timetoday");
function putzero(num) {
   return num < 10 ? `0${num}` : num;
}
function showTime() {
  let d = new Date();
  let hours = d.getHours();
  let AmOrPm = hours > 12 ? "pm" : "Am";
  let dstring = `${putzero(hours % 12)} : ${putzero(
    d.getMinutes()
  )} : ${putzero(d.getSeconds())} ${AmOrPm}`;
  currentTime.innerHTML = dstring;
  setTimeout(function () {
    showTime();
  }, 1000);
}
showTime();
