function messageAddTask() {
  addTaskFromMessage(
    "task_content",
    "task_due",
    "task_project",
    "include_message_body",
    "task_add"
  );
}

function prefillContent() {
  fillAllProjectsSelect("task_project");
  loadDefaultDue().then((res) => {
    document.getElementById("task_due").placeholder = res;
  });
  loadIncludeMessageBody().then((res) => {
    document.getElementById("include_message_body").checked = res;
  });
  getDisplayedMessage()
    .then(([message, tabId]) => {
      return browser.msgurl
        .url(tabId)
        .then((msgurl) => formatDefaultTaskContent(message, msgurl.url));
    })
    .then((defaultTaskContent) => {
      document.getElementById("task_content").value = defaultTaskContent;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("task_add").addEventListener("click", messageAddTask);
  showSettingsIfNecessary();
  prefillContent();
});
