let users = []
const token = localStorage.getItem("token")
if (!token) {
    alert("Please login first!");
    window.location.href = "/login.html";
}
async function loadUsers() {
    let res = await fetch("/users", {
        headers: { "Authorization": "Bearer " + token }
    });
    users = await res.json();

    const select = document.getElementById("assignedTo");
    select.innerHTML = "";
    users.forEach(u => {
        const option = document.createElement("option");
        option.value = u._id;
        option.textContent = u.email;
        select.appendChild(option);
    });
}


function renderTask(task, taskUL) {
    const li = document.createElement("li");
    li.className = "bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col gap-3";

    // --- Title ---
    const titleEl = document.createElement("div");
    titleEl.textContent = task.title;
    titleEl.className = "font-bold text-lg text-gray-900";
    li.appendChild(titleEl);

    // --- Description ---
    if (task.description) {
        const descEl = document.createElement("p");
        descEl.textContent = task.description;
        descEl.className = "text-gray-700 text-sm";
        li.appendChild(descEl);
    }

    // --- Deadline ---
    if (task.deadline) {
        const deadlineEl = document.createElement("div");
        deadlineEl.textContent = "Deadline: " + new Date(task.deadline).toLocaleDateString();
        deadlineEl.className = "text-sm text-gray-500";
        li.appendChild(deadlineEl);
    }

    // --- Status badge ---
    const statusEl = document.createElement("span");
    statusEl.className = "inline-block px-2 py-1 rounded text-sm font-medium";
    const status = (task.status || "").trim().toLowerCase();
    if (status === "completed") {
        statusEl.className += " bg-green-100 text-green-700";
        statusEl.innerText = "Status - Completed";
    } else if (status === "in-progress") {
        statusEl.className += " bg-blue-100 text-blue-700";
        statusEl.innerText = "Status - In Progress";
    } else {
        statusEl.className += " bg-yellow-100 text-yellow-700";
        statusEl.innerText = "Status - Pending";
    }

    // --- Priority badge ---
    const priorityEl = document.createElement("span");
    priorityEl.className = "inline-block px-2 py-1 rounded text-sm font-medium";
    const priority = (task.priority || "").trim().toLowerCase();
    if (priority === "high") {
        priorityEl.className += " bg-red-200 text-red-700";
        priorityEl.innerText = "Priority - High";
    } else if (priority === "medium") {
        priorityEl.className += " bg-orange-200 text-orange-700";
        priorityEl.innerText = "Priority - Medium";
    } else {
        priorityEl.className += " bg-gray-200 text-gray-700";
        priorityEl.innerText = "Priority - Low";
    }

    // --- Assigned user ---
    const assignedEl = document.createElement("div");
    if (task.assignedTo && typeof task.assignedTo === "object") {
        assignedEl.textContent = "Assigned to: " + task.assignedTo.email;
    } else {
        assignedEl.textContent = "Assigned to: (Unassigned)";
    }
    assignedEl.className = "text-sm text-gray-600 italic";

    const createdByEl = document.createElement("div");
createdByEl.textContent = task.createdBy
  ? "Created by: " + task.createdBy.email
  : "Created by: Unknown";
createdByEl.className = "text-sm text-gray-600 italic";

    // --- Info row (status + priority) ---
    const infoRow = document.createElement("div");
    infoRow.className = "flex gap-2 mt-1";
    infoRow.appendChild(statusEl);
    infoRow.appendChild(priorityEl);

    li.appendChild(infoRow);
    li.appendChild(createdByEl)
    li.appendChild(assignedEl);

    // --- Buttons ---
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex gap-2 mt-2";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600";
    editBtn.onclick = () => editTask(task, li);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600";
    delBtn.onclick = async () => {
        let res = await fetch(`/tasks/${task._id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) loadTasks();
    };

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);
    li.appendChild(btnContainer);

    taskUL.appendChild(li);
}

async function loadTasks() {
    let res = await fetch("/tasks", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    let tasks = await res.json();
    const taskUL = document.getElementById("taskUL");
    taskUL.innerHTML = "";

    tasks.forEach(task => renderTask(task, taskUL));
}

function editTask(task, li) {
    li.innerHTML = ""; // clear card content

    // --- Title ---
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = task.title;
    titleInput.className = "border border-gray-300 rounded px-2 py-1 w-full";

    // --- Status ---
    const statusSelect = document.createElement("select");
    ["Pending", "In-Progress", "Completed"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.toLowerCase(); // backend expects lowercase
        option.textContent = opt;
        if ((task.status || "").toLowerCase() === opt.toLowerCase()) {
            option.selected = true;
        }
        statusSelect.appendChild(option);
    });
    statusSelect.className = "border border-gray-300 rounded px-2 py-1";

    // --- Description ---
    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.value = task.description || "";
    descInput.className = "border border-gray-300 rounded px-2 py-1 w-full";

    // --- Deadline ---
    const deadlineInput = document.createElement("input");
    deadlineInput.type = "date";
    if (task.deadline) deadlineInput.value = task.deadline.split("T")[0];
    deadlineInput.className = "border border-gray-300 rounded px-2 py-1";

    // --- Priority ---
    const prioritySelect = document.createElement("select");
    ["Low", "Medium", "High"].forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.toLowerCase();
        option.textContent = opt;
        if ((task.priority || "").toLowerCase() === opt.toLowerCase()) {
            option.selected = true;
        }
        prioritySelect.appendChild(option);
    });
    prioritySelect.className = "border border-gray-300 rounded px-2 py-1";

    

    // --- Assigned To ---
    const assignedToSelect = document.createElement("select");
    users.forEach(u => {
        const option = document.createElement("option");
        option.value = u._id;
        option.textContent = u.email;
        if (task.assignedTo === u._id || task.assignedTo?._id === u._id) {
            option.selected = true;
        }
        assignedToSelect.appendChild(option);
    });
    assignedToSelect.className = "border border-gray-300 rounded px-2 py-1";

    // --- Save Button ---
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600";
    saveBtn.onclick = async () => {
        let taskData = {
            title: titleInput.value,
            status: statusSelect.value,
            description: descInput.value,
            deadline: deadlineInput.value,
            priority: prioritySelect.value,
            assignedTo: assignedToSelect.value
        };

        let res = await fetch(`/tasks/${task._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(taskData)
        });

        if (res.ok) {
            loadTasks(); // refresh list
        } else {
            console.error("Update failed", await res.text());
        }
    };

    // --- Cancel Button ---
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500";
    cancelBtn.onclick = () => loadTasks(); // reload original card

    // --- Layout ---
    li.appendChild(titleInput);
    li.appendChild(descInput);
    li.appendChild(deadlineInput);
    li.appendChild(statusSelect);
    li.appendChild(prioritySelect);
    li.appendChild(assignedToSelect);

    const actionRow = document.createElement("div");
    actionRow.className = "flex gap-2 mt-2";
    actionRow.appendChild(saveBtn);
    actionRow.appendChild(cancelBtn);

    li.appendChild(actionRow);
}


//Add new task

document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const task = {

        title: document.getElementById("taskTitle").value,
        status: document.getElementById("Taskstatus").value,
        description: document.getElementById("taskDescription").value,
        deadline: document.getElementById("deadline").value,
        priority: document.getElementById("Priority").value,
        assignedTo: document.getElementById("assignedTo").value

    }

    let res = await fetch("/tasks", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(task) })
    if (res.ok) {
        document.getElementById("taskForm").reset()
        loadTasks()
    }

})
loadTasks()
loadUsers()
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}; 