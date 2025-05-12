// Sélectionner les éléments du DOM
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const clearCompletedTasksButton = document.getElementById("clearAllButton");

// Sélectionner les boutons de filtre
const allTasksButton = document.getElementById("allTasksButton");
const activeTasksButton = document.getElementById("activeTasksButton");
const completedTasksButton = document.getElementById("completedTasksButton");

// Fonction pour charger les tâches avec un filtre
function loadTasks(filter = "all") {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = ""; // Vider la liste avant de la remplir

    // Appliquer le filtre
    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        return true; // "all" retourne toutes les tâches
    });

    // Ajouter les tâches filtrées à la liste
    filteredTasks.forEach((task, index) => {
        addTaskToList(task, index);
    });
}

// Fonction pour ajouter une tâche à la liste HTML
function addTaskToList(task, index) {
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskCompletion(this, ${index})" />
    <span>${task.text}</span>
    <div class="buttons">
        <button class="editButton" onclick="editTask(${index})">✏️</button>
        <button class="deleteButton" onclick="deleteTask(${index})">🗑️</button>
    </div>
  `;
    if (task.completed) {
        li.classList.add("completed");
    }
    taskList.appendChild(li);
}

// Fonction pour basculer l'état de complétion d'une tâche
function toggleTaskCompletion(checkbox, index) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = checkbox.checked; // Mettre à jour l'état de complétion
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(); // Recharger les tâches pour refléter les changements
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
clearCompletedTasksButton.addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment effacer les tâches terminées ?")) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const incompleteTasks = tasks.filter(task => !task.completed); // Garder uniquement les tâches non terminées
        localStorage.setItem("tasks", JSON.stringify(incompleteTasks));
        loadTasks(); // Recharger les tâches
    }
});

// Ajouter des gestionnaires d'événements pour les boutons de filtre
allTasksButton.addEventListener("click", () => loadTasks("all"));
activeTasksButton.addEventListener("click", () => loadTasks("active"));
completedTasksButton.addEventListener("click", () => loadTasks("completed"));

// Charger toutes les tâches au démarrage
loadTasks();
