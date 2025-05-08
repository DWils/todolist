from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

log_lines = []

def log(step, success):
    status = "[V]" if success else "[X]"
    line = f"{status} {step}"
    print(line)
    log_lines.append(line)

def wait_and_find(by, value, timeout=5):
    for _ in range(timeout * 2):
        try:
            return driver.find_element(by, value)
        except:
            time.sleep(0.5)
    raise Exception(f"Élément non trouvé : {value}")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("https://dwils.github.io/todolist/")
time.sleep(1)

try:
    # Étape 1 : Ajouter une tâche
    input_box = wait_and_find(By.ID, "taskInput")
    add_button = wait_and_find(By.ID, "addTaskButton")
    task_name = "Tache de test"
    input_box.clear()
    input_box.send_keys(task_name)
    add_button.click()
    time.sleep(1)
    log("Ajout d'une tâche", task_name in driver.page_source)

    # Étape 2 : Modifier la tâche
    edit_button = driver.find_element(By.XPATH, "//li[span[text()='Tache de test']]//button[contains(text(),'✏️')]")
    edit_button.click()
    time.sleep(1)
    alert = Alert(driver)
    alert.send_keys("Tache modifiee")
    alert.accept()
    time.sleep(1)
    log("Modification de la tâche", "Tache modifiee" in driver.page_source)

    # Étape 3 : Supprimer la tâche
    delete_button = driver.find_element(By.XPATH, "//li[span[text()='Tache modifiee']]//button[contains(text(),'🗑️')]")
    delete_button.click()
    time.sleep(1)
    log("Suppression de la tâche", "Tache modifiee" not in driver.page_source)

    # Étape 4 : Ajouter deux tâches
    success = True
    for i in range(2):
        input_box.send_keys(f"Tache {i+1}")
        add_button.click()
        time.sleep(0.5)
        if f"Tache {i+1}" not in driver.page_source:
            success = False
    log("Ajout de deux tâches", success)

    # Étape 5 : Effacement complet
    clear_button = driver.find_element(By.ID, "clearAllButton")
    clear_button.click()
    time.sleep(0.5)
    alert = Alert(driver)
    alert.accept()
    time.sleep(1)
    success = all(task not in driver.page_source for task in ["Tache 1", "Tache 2"])
    log("Effacement complet des tâches", success)

except Exception as e:
    error_line = f"[X] Erreur inattendue : {str(e)}"
    print(error_line)
    log_lines.append(error_line)

finally:
    driver.quit()
    print("Fermeture du navigateur.")

    # Export du log
    with open("log.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines))
    print("Rapport sauvegardé dans log.txt")
