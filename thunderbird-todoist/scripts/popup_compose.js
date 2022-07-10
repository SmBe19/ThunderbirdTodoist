function messageAddTask() {
  const content = document.getElementById('task_content').value;
  const due = document.getElementById('task_due').value || 'Today';
  const project = getSelectedProject('task_project');
  const messageContent = message.content;
  addTask(content, due, project, messageContent).then(res => {
    window.close();
  });
}

function prefillContent() {
  fillAllProjectsSelect('task_project');
  browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then(tabs => {
    let tabId = tabs[0].id;
    browser.messageDisplay.getDisplayedMessage(tabId).then((message) => {
      document.getElementById('task_content').value = 'Mail by ' + message.author + ': ' + message.subject;
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('task_add').addEventListener('click', messageAddTask);
  showSettingsIfNecessary();
  // TODO figure out how to get current subject
  //prefillContent();
});
