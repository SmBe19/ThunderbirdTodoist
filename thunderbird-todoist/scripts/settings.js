function saveSettings() {
  const token = document.getElementById('apitoken').value;
  const defaultproject = getSelectedProject('defaultproject');
  const maillink = document.getElementById('maillink').checked;
  browser.storage.local.set({
    apitoken: token,
    defaultproject: defaultproject,
    maillink: maillink ? '1' : '0',
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
  initSettings();
});
