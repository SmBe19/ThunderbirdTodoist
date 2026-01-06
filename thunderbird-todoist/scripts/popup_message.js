function messageAddTask() {
  addTaskFromMessage(
    "task_content",
    "task_due",
    "task_project",
    "task_assignee",
    "task_description",
    "include_message_body",
    "task_add"
  );
}

function prefillContent() {
  fillAllProjectsSelect("task_project");
  loadDefaultProject().then((projectid) => {
    fillAssigneeSelect("task_assignee", projectid);
  });
  loadDefaultDue().then((res) => {
    document.getElementById("task_due").placeholder = res;
  });
  loadIncludeMessageBody().then((res) => {
    document.getElementById("include_message_body").checked = res;
  });
  getDisplayedMessage().then(([message, tabId]) => {
    formatDefaultTaskContent(message).then((defaultTaskContent) => {
      document.getElementById("task_content").value = defaultTaskContent;
    });
    formatDefaultTaskContentDescription(message).then((defaultDescription) => {
      document.getElementById("task_description").value = defaultDescription;
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("task_add").addEventListener("click", messageAddTask);
  document.getElementById("task_project").addEventListener("change", () => {
    const project = getSelectedValue("task_project");
    fillAssigneeSelect("task_assignee", project);
  });
  showSettingsIfNecessary();
  prefillContent();
});
