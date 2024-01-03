function messageAddTask() {
  addTaskFromMessage(
    "task_content",
    "task_due",
    "task_project",
    "task_assignee",    
    undefined,
    "task_add"
  );
}

function prefillContent() {
  fillAllProjectsSelect("task_project");
  loadDefaultProject().then((project) => {
        fillAllCollaboratorsSelect("task_assignee", project);
      });  
  loadDefaultDue().then((res) => {
    document.getElementById("task_due").placeholder = res;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("task_add").addEventListener("click", messageAddTask);

  document
    .getElementById("task_project")
    .addEventListener("change", (event) => {
      const project = event.target.value;
      fillAllCollaboratorsSelect("task_assignee", project);
    });
  
  showSettingsIfNecessary();
  prefillContent();
});
