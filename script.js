document.getElementById("addTaskButton").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

document
  .getElementById("downloadButton")
  .addEventListener("click", downloadTaskList);
document.getElementById("shareButton").addEventListener("click", shareTaskList);
document.getElementById("printButton").addEventListener("click", printTaskList);

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  const priorityInput = document.getElementById("priorityInput");
  const timeInput = document.getElementById("timeInput");

  if (taskText === "") {
    alert("Please enter a task description.");
    return;
  }

  const taskTime = parseInt(timeInput.value, 10);
  if (isNaN(taskTime) || taskTime <= 0 || taskTime > 1440) {
    alert("Please enter a valid time in minutes (1 to 1440).");
    return;
  }

  const totalTaskTime = getTotalTaskTime() + taskTime;
  if (totalTaskTime > 1440) {
    alert("Total task time cannot exceed 1440 minutes in a day.");
    return;
  } else if (totalTaskTime > 960) {
    alert(
      "Warning: Total task time exceeds 960 minutes. Sleep time may be less than 480 minutes. A day has a maximum of 1440 minutes."
    );
  }

  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");
  li.className = "task-item";

  const prioritySymbol =
    priorityInput.value === "low"
      ? "★"
      : priorityInput.value === "medium"
      ? "★★"
      : "★★★";

  li.innerHTML = `
    <span>${taskText}</span>
    <span>${prioritySymbol}</span>
    <span>${taskTime}</span>
    <input type="checkbox" class="complete-btn" onclick="toggleComplete(this)">
    <button class="delete-btn" onclick="deleteTask(this)">🗑</button>
  `;

  taskList.appendChild(li);
  taskInput.value = "";
  timeInput.value = "";

  renumberTasks();
}

function toggleComplete(checkbox) {
  const taskItem = checkbox.parentElement;
  taskItem.classList.toggle("completed");
}

function deleteTask(button) {
  const taskItem = button.parentElement;
  taskItem.remove();
  renumberTasks();
}

function renumberTasks() {
  const taskItems = document.querySelectorAll(".task-item");
  taskItems.forEach((item, index) => {
    item.children[0].textContent = `${index + 1}. ${
      item.children[0].textContent.split(". ")[1] ||
      item.children[0].textContent
    }`;
  });
}

function getTotalTaskTime() {
  const taskItems = document.querySelectorAll(".task-item span:nth-child(3)");
  let total = 0;
  taskItems.forEach((item) => {
    total += parseInt(item.textContent, 10);
  });
  return total;
}

function downloadTaskList() {
  const taskItems = document.querySelectorAll(".task-item");
  let tasks = "";
  taskItems.forEach((item, index) => {
    const taskText = item.children[0].textContent.split(". ")[1]; // Extract text without number
    const priority = item.children[1].textContent;
    const time = item.children[2].textContent;
    tasks += `${index + 1}. ${taskText} ${priority} ${time} minutes\n`;
  });

  const blob = new Blob([tasks], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "task-list.txt";
  link.click();
}

function shareTaskList() {
  const taskItems = document.querySelectorAll(".task-item span:first-child");
  let tasks = "";
  taskItems.forEach((item) => {
    tasks += item.textContent + "\n";
  });

  const shareData = {
    title: "My To-Do List",
    text: tasks,
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    alert("Sharing not supported on this browser");
  }
}

function printTaskList() {
  const originalContents = document.body.innerHTML;
  const printContents = document.querySelector(".container").cloneNode(true); // Clone the entire container including the task list
  const taskList = document.getElementById("taskList").cloneNode(true); // Clone the task list
  printContents.appendChild(taskList); // Append the cloned task list to the cloned container

  // Create a temporary container to hold the printable content
  const tempContainer = document.createElement("div");
  tempContainer.appendChild(printContents);

  document.body.innerHTML = tempContainer.innerHTML;
  window.print();
  document.body.innerHTML = originalContents;
}

const shareButton = document.getElementById("share-button");
const hint = document.getElementById("click-hint");

const toggleSocials = () => {
  const socialsWrapper = document.querySelector(".socials-wrapper");
  const shareButtonImage = shareButton.querySelector("img");

  socialsWrapper.classList.toggle("active");

  // Hide the hint text once the image is clicked
  hint.style.display = "none";

  if (shareButtonImage.src.includes("ponITech - shorten logo_without_n.svg")) {
    shareButtonImage.src = "images/close.svg";
  } else {
    shareButtonImage.src = "images/ponITech - shorten logo_without_n.svg";
  }
};

shareButton.addEventListener("click", toggleSocials);
