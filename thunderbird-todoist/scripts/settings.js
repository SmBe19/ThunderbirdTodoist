function saveSettings() {
  const token = document.getElementById('apitoken').value;
  const defaultproject = getSelectedProject('defaultproject');
  browser.storage.local.set({
    apitoken: token,
    defaultproject: defaultproject,
  });
}

function saveAndLoadProjects() {
  saveSettings();
  fillAllProjectsSelect('defaultproject');
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
  document.getElementById('defaultproject').addEventListener('change', saveSettings);
  initSettings();
});
