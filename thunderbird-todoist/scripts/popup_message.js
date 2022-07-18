function messageAddTask() {
  addTaskFromMessage('task_content', 'task_due', 'task_project', 'include_message_body', 'task_add');
}

function prefillContent() {
  fillAllProjectsSelect('task_project');
  loadDefaultDue().then(res => {
    document.getElementById('task_due').placeholder = res;
  });
  loadIncludeMessageBody().then(res => {
    document.getElementById('include_message_body').checked = res;
  });
  getDisplayedMessage().then(([message, tabId]) => {
    loadMaillink().then(maillink => {
      if (maillink) {
        browser.msgurl.url(tabId).then(url => {
          document.getElementById('task_content').value = '[Mail by ' + message.author + ': ' + message.subject + '](' + url.url + ')';
        });
      } else {
        document.getElementById('task_content').value = 'Mail by ' + message.author + ': ' + message.subject;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('task_add').addEventListener('click', messageAddTask);
  showSettingsIfNecessary();
  prefillContent();
});
