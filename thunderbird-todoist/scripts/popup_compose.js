function messageAddTask() {
  addTaskFromMessage(
    "task_content",
    "task_due",
    "task_project",
    undefined,
    "task_add"
  );
}

function prefillContent() {
  fillAllProjectsSelect("task_project");
  loadDefaultDue().then((res) => {
    document.getElementById("task_due").placeholder = res;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("task_add").addEventListener("click", messageAddTask);
  showSettingsIfNecessary();
  prefillContent();
});
