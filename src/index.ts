// Import the UUID library to generate unique identifiers for tasks
import { v4 as uuidV4 } from "uuid";

// Retrieve references to HTML elements
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");

// Define the Task type
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

// Load tasks from local storage or initialize an empty array
const tasks: Task[] = loadTasks();

// Iterate through each task and add it to the list
tasks.forEach(addListItem);

// Add event listener to the form for submitting new tasks
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input || input.value.trim() === "") return;
  
  // Create a new task object
  const task: Task = {
    id: uuidV4(), // Generate a unique ID for the task
    title: input.value.trim(), // Get the task title from the input field
    completed: false, // Set the task as incomplete by default
    createdAt: new Date() // Set the creation date of the task
  };

  // Add the new task to the tasks array
  tasks.push(task);

  // Add the new task to the list
  addListItem(task);

  // Clear the input field after adding the task
  input.value = "";
});

// Function to add a task item to the list
function addListItem(task: Task): void {
  // Create a new list item element
  const item = document.createElement("li");

  // Create a label element to contain the task information
  const label = document.createElement("label");
  label.style.display = "block"; // Ensure each label appears on its own line
  label.style.marginBottom = "5px"; // Add some space between labels
  label.style.cursor = "pointer"; // Add a pointer cursor for interactivity
  
  // Create a checkbox element for task completion statuss
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.cursor = "pointer"; // Add a pointer cursor for interactivity
  checkbox.checked = task.completed; // Set the initial state of the checkbox
  label.appendChild(checkbox);

  // Create a span element to display the task title
  const titleSpan = document.createElement("span");
  titleSpan.textContent = task.title; // Set the task title text
  titleSpan.style.marginLeft = "10px"; // Add some space between checkbox and text
  const br = document.createElement("br"); // Add a line break for better readability
  // Create a span element to display the task creation date
  const date = document.createElement("span");
  // Convert the Date object to a string representation
  const createdAtDate = new Date(task.createdAt);
  const dateString = createdAtDate instanceof Date ? createdAtDate.toLocaleDateString() : 'Invalid Date';
  const timeString = createdAtDate instanceof Date ? createdAtDate.toLocaleTimeString() : 'Invalid time';

  // Set the text content of the date span
  date.textContent = `Date: ${dateString} ${timeString}`;
  // Add some styling to the date span
  date.style.marginLeft = "10px"; // Add some space between checkbox and text
  // Append the date span to the label
  
  
  // Event listener for checkbox change to update task completion status
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    titleSpan.style.textDecoration = task.completed ? "line-through" : "none"; // Cross out completed tasks
    
    saveTasks(); // Save the updated task list to local storage
  });
  label.appendChild(titleSpan);
  label.appendChild(br);
  label.appendChild(date);


  // Create an "Edit" button for modifying task title
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";

  editButton.addEventListener("click", () => {
    const newTitle = prompt("Enter new title for the task:", task.title);
    if (newTitle !== null) {
      task.title = newTitle;
      titleSpan.textContent = newTitle; // Update the text content
      saveTasks(); // Save the updated task list to local storage
    }
  });

  // Create a "Delete" button for removing the task
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.marginBottom = "15px"; // Add some space between labels

  // Event listener for delete button to remove the task
  deleteButton.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      const taskIndex = tasks.findIndex(t => t.id === task.id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks(); // Save the updated task list to local storage
        item.remove(); // Remove the task item from the list
      }
    }
  });

  // Append label, edit button, and delete button to the list item
  item.append(label, editButton, deleteButton);
  list?.append(item);

  // Save the tasks to local storage after adding/updating a task
  saveTasks();
}

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks(): Task[] {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}
