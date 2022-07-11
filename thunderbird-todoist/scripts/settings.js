function saveSettings() {
  const token = document.getElementById('apitoken').value;
  const defaultproject = getSelectedProject('defaultproject');
  const maillink = document.getElementById('maillink').checked;
  const includeMessageBody = document.getElementById('includeMessageBody').checked;
  browser.storage.local.set({
    apitoken: token,
    defaultproject: defaultproject,
    maillink: maillink ? '1' : '0',
    includeMessageBody: includeMessageBody ? '1' : '0',
  });
}

function saveAndLoadProjects() {
  saveSettings();
  fillAllProjectsSelect('defaultproject');
}

function enableApplyToken() {
  document.getElementById('tokenapplybutton').disabled = false;
}

function applyToken() {
  saveAndLoadProjects();
  document.getElementById('tokenapplybutton').disabled = true;
}

function initSettings() {
  loadAPIToken().then(token => {
    document.getElementById('apitoken').value = token || '';
    if (token) {
      fillAllProjectsSelect('defaultproject');
    }
  });
  loadMaillink().then(res => {
    document.getElementById('maillink').checked = res;
  });
  loadMaillink().then(res => {
    document.getElementById('includeMessageBody').checked = res;
  });
}

function hideSettings() {
  document.getElementById('popup-settings').style.display = 'none';
  document.getElementById('popup-page').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('apitoken').addEventListener('change', saveAndLoadProjects);
  document.getElementById('apitoken').addEventListener('keyup', enableApplyToken);
  document.getElementById('defaultproject').addEventListener('change', saveSettings);
  document.getElementById('tokenapplybutton').addEventListener('click', applyToken);
  document.getElementById('maillink').addEventListener('change', saveSettings);
  document.getElementById('includeMessageBody').addEventListener('change', saveSettings);
  initSettings();
});
