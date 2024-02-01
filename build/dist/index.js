import {v4 as uuidV4} from "../_snowpack/pkg/uuid.js";
const list = document.querySelector("#list");
const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-title");
const tasks = loadTasks();
tasks.forEach(addListItem);
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input || input.value.trim() === "")
    return;
  const task = {
    id: uuidV4(),
    title: input.value.trim(),
    completed: false,
    createdAt: new Date()
  };
  tasks.push(task);
  addListItem(task);
  input.value = "";
});
function addListItem(task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  label.style.display = "block";
  label.style.marginBottom = "5px";
  label.style.cursor = "pointer";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.cursor = "pointer";
  checkbox.checked = task.completed;
  label.appendChild(checkbox);
  const titleSpan = document.createElement("span");
  titleSpan.textContent = task.title;
  titleSpan.style.marginLeft = "10px";
  const br = document.createElement("br");
  const date = document.createElement("span");
  const createdAtDate = new Date(task.createdAt);
  const dateString = createdAtDate instanceof Date ? createdAtDate.toLocaleDateString() : "Invalid Date";
  const timeString = createdAtDate instanceof Date ? createdAtDate.toLocaleTimeString() : "Invalid time";
  date.textContent = `Date: ${dateString} ${timeString}`;
  date.style.marginLeft = "10px";
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    titleSpan.style.textDecoration = task.completed ? "line-through" : "none";
    saveTasks();
  });
  label.appendChild(titleSpan);
  label.appendChild(br);
  label.appendChild(date);
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    const newTitle = prompt("Enter new title for the task:", task.title);
    if (newTitle !== null) {
      task.title = newTitle;
      titleSpan.textContent = newTitle;
      saveTasks();
    }
  });
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.marginBottom = "15px";
  deleteButton.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      const taskIndex = tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        item.remove();
      }
    }
  });
  item.append(label, editButton, deleteButton);
  list?.append(item);
  saveTasks();
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}
