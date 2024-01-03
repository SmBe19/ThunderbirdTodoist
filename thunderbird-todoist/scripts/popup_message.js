function messageAddTask() {
  addTaskFromMessage(
    "task_content",
    "task_due",
    "task_project",
    "task_assignee",
    "include_message_body",
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
  loadIncludeMessageBody().then((res) => {
    document.getElementById("include_message_body").checked = res;
  });
  getDisplayedMessage()
    .then(([message, tabId]) => {
      return formatDefaultTaskContent(message);
    })
    .then((defaultTaskContent) => {
      document.getElementById("task_content").value = defaultTaskContent;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document.
    getElementById("task_add").
    addEventListener("click", messageAddTask);

  document
    .getElementById("task_project")
    .addEventListener("change", (event) => {
      const project = event.target.value;
      fillAllCollaboratorsSelect("task_assignee", project);
    });

  showSettingsIfNecessary();
  prefillContent();
});

