function messageAddTask() {
  addTaskFromMessage('task_content', 'task_due', 'task_project', undefined, 'task_add');
}

function prefillContent() {
  fillAllProjectsSelect('task_project');
  getDisplayedMessage().then(([message]) => {
    document.getElementById('task_content').value = 'Mail by ' + message.author + ': ' + message.subject;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('task_add').addEventListener('click', messageAddTask);
  showSettingsIfNecessary();
  // TODO figure out how to get current subject
  //prefillContent();
});
