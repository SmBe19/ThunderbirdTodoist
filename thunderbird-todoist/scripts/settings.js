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
  hideSettings();
}

function showSettings() {
  document.getElementById('popup-settings').style.display = 'block';
  document.getElementById('popup-page').style.display = 'none';
  loadAPIToken().then(token => {
    document.getElementById('apitoken').value = token || '';
    if (token) {
      loadDefaultProject().then(proj => {
        fillAllProjectsSelect('defaultproject', proj);
      });
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
  document.getElementById('apitoken_save').addEventListener('click', saveSettings);
  document.getElementById('show_settings').addEventListener('click', showSettings);

  hideSettings();
  showSettingsIfNeeded();
});
