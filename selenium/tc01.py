import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

@pytest.fixture
def setup():
    driver = webdriver.Chrome()
    driver.get("https://dwils.github.io/todolist/")
    yield driver
    driver.quit()

def test_ajout_tache_valide(setup):
    driver = setup
    task_input = driver.find_element(By.XPATH, "//input[@placeholder='Ajouter une tâche...']")
    task_input.send_keys("Tache 1")
    send_task_button = driver.find_element(By.ID, "addTaskButton")
    send_task_button.click()
    
    time.sleep(2)
    tasks = driver.find_elements(By.ID, "taskList")
    assert any("Tache 1" in task.text for task in tasks), "La tâche n’a pas été ajoutée"

def test_ajout_tache_vide(setup):
    driver = setup
    task_input = driver.find_element(By.XPATH, "//input[@placeholder='Ajouter une tâche...']")
    task_input.send_keys("")
    send_task_button = driver.find_element(By.ID, "addTaskButton")
    send_task_button.click()

    time.sleep(2)
    error_message = driver.find_elements(By.ID, "errorMessage")  # Exemple, dépend de l’implémentation
    assert error_message, "Aucun message d’erreur affiché"


def test_ajout_taches_multiples(setup):
    driver = setup
    task_input = driver.find_element(By.XPATH, "//input[@placeholder='Ajouter une tâche...']")
    add_button = driver.find_element(By.ID, "addTaskButton")

    # Ajout des tâches
    tasks_to_add = ["Tache 1", "Tache 2", "Tache 3"]
    for task in tasks_to_add:
        task_input.clear()
        task_input.send_keys(task)
        add_button.click()
        time.sleep(1)

    # Vérification de l'affichage des tâches : <span> dans <li> sous <ul id="taskList">
    task_spans = driver.find_elements(By.XPATH, "//ul[@id='taskList']/li/span")
    task_texts = [task.text.strip() for task in task_spans]

    assert task_texts == tasks_to_add, f"Les tâches affichées sont incorrectes : {task_texts}"