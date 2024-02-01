import { v4 as uuidV4 } from "uuid";

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");



type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const tasks: Task[] = loadTasks();

tasks.forEach(addListItem);


form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input || input.value.trim() === "") return;
  
  const task: Task = {
    id: uuidV4(),
    title: input.value.trim(),
    completed: false,
    createdAt: new Date()
  };

  tasks.push(task);

  addListItem(task);
  input.value = ""; // Clear the input field after adding the task
});

function addListItem(task: Task): void {
  const item = document.createElement("li");

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    console.log(tasks)
    saveTasks();

  })
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    // Implement edit functionality here
    console.log("Edit task:", task);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    // Implement delete functionality here
    console.log("Delete task:", task);
    item.remove(); // Remove the task item from the list
  });
  
  item.append(label, editButton, deleteButton);
  list?.append(item);
  saveTasks();
}

function  saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}
