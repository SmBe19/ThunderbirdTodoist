function messageAddTask() {
  const content = document.getElementById('task_content').value;
  const due = document.getElementById('task_due').value;
  const project = getSelectedProject('task_project');
  addTask(content, due, project).then(res => {
    window.close();
  });
}

function prefillContent() {
  loadDefaultProject().then(proj => {
    fillAllProjectsSelect('task_project', proj);
  });
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
  prefillContent();
});
