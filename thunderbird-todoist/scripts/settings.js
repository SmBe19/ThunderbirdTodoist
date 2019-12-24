function loadAPIToken() {
  return browser.storage.local.get('apitoken').then(token => token.apitoken);
}

function loadDefaultProject() {
  return browser.storage.local.get('defaultproject').then(token => token.defaultproject);
}

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

function showSettings() {
  document.getElementById('popup-settings').style.display = 'block';
  document.getElementById('popup-page').style.display = 'none';
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

function showSettingsIfNeeded() {
  loadAPIToken().then(token => {
    if (typeof token === 'undefined') {
      showSettings();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('hide_settings').addEventListener('click', hideSettings);
  document.getElementById('show_settings').addEventListener('click', showSettings);
  document.getElementById('apitoken').addEventListener('change', saveAndLoadProjects);
  document.getElementById('defaultproject').addEventListener('change', saveSettings);

  hideSettings();
  showSettingsIfNeeded();
});
