function messageAddTask() {
  const content = document.getElementById('task_content').value;
  const due = document.getElementById('task_due').value || 'Today';
  const project = getSelectedProject('task_project');
  addTask(content, due, project).then(res => {
    window.close();
  })
  .catch(err => {
    document.getElementById('task_add').innerHTML = 'Adding Task failed...'
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
      loadMaillink().then(maillink => {
        if (maillink) {
          browser.msgurl.url(tabId).then(url => {
            document.getElementById('task_content').value = '[Mail by ' + message.author + ': ' + message.subject + '](' + url.url + ')';
          });
        } else {
          document.getElementById('task_content').value = 'Mail by ' + message.author + ': ' + message.subject;
        }
      })
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('task_add').addEventListener('click', messageAddTask);
  showSettingsIfNecessary();
  prefillContent();
});
