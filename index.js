import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
import { getDatabase, 
            ref,
            push,
            onValue, 
            remove,
            update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"


const firebaseConfig = {
    databaseURL: "https://zoro-s-to-do-list-default-rtdb.asia-southeast1.firebasedatabase.app/"
}


const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "Zoro Task")



const inputEl = document.getElementById("input-el")
const addBtn = document.getElementById("add-btn")
const delAll = document.getElementById("del-all")
const taskList = document.getElementById("task-list")


onValue(referenceInDB, (snapshot) => {
    const tasks = snapshot.val()
    const tasksArray = tasks ? Object.keys(tasks).map(id => ({id, ...tasks[id]})) : []
    console.log(tasksArray)
    render(tasksArray)
})

 function addTask(){
    if (inputEl.value.trim() !== ""){
        const newTask = {
            task: inputEl.value.trim(),
            isChecked: false
        }
        push(referenceInDB, newTask)
        inputEl.value = ""
    }
 }

addBtn.addEventListener("click", addTask)

inputEl.addEventListener("keydown", function(e){
   if(e.key === "Enter"){
       addTask()
}})

function render(tasks) {
    let allTasksHTML = "";
    tasks.forEach(task => {
        allTasksHTML += `
        <li class="list">
            ${task.task}
            <button class="del-btn" data-id="${task.id}">DEL</button>
            <input class="checkBox" type="checkbox" data-id="${task.id}" ${task.isChecked ? "checked" : ""}>
        </li>`;
    });
    taskList.innerHTML = allTasksHTML

    document.querySelectorAll(".del-btn").forEach(button =>{
        button.addEventListener("click", function(){
            const taskId = button.getAttribute("data-id")
            deleteTask(taskId)
        })
    })

    document.querySelectorAll(".checkBox").forEach(checkbox => {
        checkbox.addEventListener("change", function(){
            const taskId = checkbox.getAttribute("data-id")
            updateTaskStatus(taskId, checkbox.checked)
            
        })
    })
}

function deleteTask(taskId){
    const taskRef = ref(database, `Zoro Task/${taskId}`)
    remove(taskRef)
}

function updateTaskStatus(taskId, isChecked){
    const indexRef = ref(database, `Zoro Task/${taskId}`)
    update(indexRef, {isChecked})
}

delAll.addEventListener("dblclick", function(){
    remove(referenceInDB);
})