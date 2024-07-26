document.addEventListener("DOMContentLoaded", function () {
	const taskForm = document.getElementById("taskForm");
	const taskInput = document.getElementById("taskInput");
	const pendingTasksList = document.getElementById("pendingTasksList");

	loadTasks();

	taskForm.addEventListener("submit", function (e) {
		e.preventDefault();
		const taskName = taskInput.value.trim();
		if (taskName === "") return;

		const taskId = Date.now();

		const taskItem = createTaskItem(taskName, taskId, "0:00:00");
		pendingTasksList.appendChild(taskItem);
		saveTask(taskName, taskId, "0:00:00");
		taskInput.value = "";
	});

	pendingTasksList.addEventListener("click", function (e) {
		if (e.target.classList.contains("start-btn")) {
			startTimer(e.target);
		} else if (e.target.classList.contains("stop-btn")) {
			stopTimer(e.target);
		}
	});

	function createTaskItem(taskName, taskId, timeSpent) {
		const taskItem = document.createElement("li");
		taskItem.dataset.id = taskId;
		taskItem.innerHTML = `
		<span>${taskName}</span>
		<div>
		   <button class="task-btn start-btn">Start</button>
		   <button class="task-btn stop-btn" disabled>Stop</button>
		</div>
		<span class="time">${timeSpent}</span>
		`;

		return taskItem;
	}

	function startTimer(btn) {
		const listItem = btn.closest("li");
		const startTime = new Date().getTime();

		listItem.dataset.startTime = startTime;
		listItem.dataset.timer = setInterval(updateTime, 1000, listItem);
		btn.disabled = true;
		listItem.querySelector(".stop-btn").disabled = false;
	}

	function stopTimer(btn) {
		const listItem = btn.closest("li");
		const startTime = parseInt(listItem.dataset.startTime);
		const elapsedTime = new Date().getTime() - startTime;

		clearInterval(listItem.dataset.timer);
		listItem.dataset.startTime = null;
		btn.disabled = true;
		listItem.querySelector(".start-btn").disabled = false;

		const timeSpent = formatTime(elapsedTime);
		listItem.querySelector(".time").textContent = timeSpent;
		updateTaskTime(listItem.dataset.id, timeSpent);
	}

	function updateTime(listItem) {
		const startTime = parseInt(listItem.dataset.startTime);
		const elapsedTime = new Date().getTime() - startTime;
		const timeSpent = formatTime(elapsedTime);
		listItem.querySelector(".time").textContent = timeSpent;
	}

	function formatTime(milliseconds) {
		const hours = Math.floor(milliseconds / 3600000);
		const minutes = Math.floor((milliseconds % 3600000) / 60000);
		const seconds = Math.floor((milliseconds % 60000) / 1000);
		return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	}

	function saveTask(name, id, timeSpent) {
		const tasks = JSON.parse(localStorage.getItem("task")) || [];
		tasks.push({ name, id, timeSpent });
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	function updateTaskTime(id, timeSpent) {
		const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		const task = tasks.find((task) => task.id == id);
		if (task) {
			task.timeSpent = timeSpent;
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}
	}

	function loadTasks() {
		const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		tasks.forEach((task) => {
			const taskItem = createTaskItem(task.name, task.id, task.timeSpent);
			pendingTasksList.appendChild(taskItem);
		});
	}
});
