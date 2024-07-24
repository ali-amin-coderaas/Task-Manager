document.addEventListener("DOMContentLoaded", function () {
	const taskForm = document.getElementById("taskForm");
	const taskInput = document.getElementById("taskInput");
	const taskList = document.getElementById("taskList");

	taskForm.addEventListener("submit", function (e) {
		e.preventDefault();
		const taskName = taskInput.value.trim();
		if (taskName === "") return;

		const taskItem = document.createElement("li");
		taskItem.innerHTML = `
		<span>${taskName}</span>
		<div>
		  <button class="task-btn start-btn">Start</button>
	     <button class="task-btn stop-btn">Stop</button>
		</div>
		<span class="time">0:00:00<span>
		`;
		taskList.appendChild(taskItem);
		taskInput.value = "";
	});

	taskList.addEventListener("click", function (e) {
		if (e.target.classList.contains("start-btn")) {
			startTimer(e.target);
		} else if (e.target.classList.contains("stop-btn")) {
			stopTimer(e.target);
		}
	});

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
});
