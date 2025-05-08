// Sélectionner les éléments du DOM
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const clearAllButton = document.getElementById("clearAllButton");

// Fonction pour charger les tâches depuis localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = ""; // Vider la liste avant de la remplir
    tasks.forEach((task, index) => {
        addTaskToList(task, index);
    });
}

// Fonction pour ajouter une tâche à la liste HTML
function addTaskToList(task, index) {
    const li = document.createElement("li");
    li.innerHTML = `
    <span>${task.text}</span>
    <div class="buttons">
        <button class="editButton" onclick="editTask(${index})">✏️</button>
        <button class="deleteButton" onclick="deleteTask(${index})">🗑️</button>
    </div>
  `;
    li.addEventListener("click", () => toggleTaskCompletion(li, index)); // Ajouter un gestionnaire d'événement pour le clic
    if (task.completed) {
        li.classList.add("completed");
    }
    taskList.appendChild(li);
}

// Fonction pour basculer l'état de complétion d'une tâche
function toggleTaskCompletion(li, index) {
    li.classList.toggle("completed");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = li.classList.contains("completed");
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Ajouter une tâche
addTaskButton.addEventListener("click", () => {
    const task = taskInput.value.trim();
    if (task !== "") {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text: task, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks(); // Recharger les tâches
        taskInput.value = ""; // Réinitialiser le champ de saisie
    }
});

// Supprimer une tâche
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1); // Supprimer la tâche à l'index spécifié
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(); // Recharger les tâches
}

// Modifier une tâche
function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const newTask = prompt("Modifier la tâche:", tasks[index].text);
    if (newTask !== null && newTask.trim() !== "") {
        tasks[index].text = newTask.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks(); // Recharger les tâches
    }
}

// Effacer toutes les tâches
clearAllButton.addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment effacer toutes les tâches ?")) {
        localStorage.removeItem("tasks");
        loadTasks(); // Recharger les tâches
    }
});

// Charger les tâches au démarrage
loadTasks();
