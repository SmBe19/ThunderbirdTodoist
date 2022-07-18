function saveSettings() {
  const token = document.getElementById('apitoken').value;
  const defaultproject = getSelectedProject('defaultproject');
  const defaultdue = document.getElementById('defaultdue').value;
  let defaultContentFormat = document.getElementById('defaultcontentformat').value;
  if (defaultContentFormat === 'custom') {
    defaultContentFormat = document.getElementById('defaultcontentformat-custom').value;
  }
  const includeMessageBody = document.getElementById('include_message_body').checked;
  browser.storage.local.set({
    apitoken: token,
    defaultproject: defaultproject,
    defaultdue: defaultdue,
    defaultcontentformat: defaultContentFormat,
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

function updateCustomTaskFormat() {
  const value = document.getElementById('defaultcontentformat').value;
  let maillink = false;
  let custom = false;
  if (value.includes('%msgurl%')) {
    maillink = true;
  } else if (value === 'custom') {
    maillink = true;
    custom = true;
  }
  document.getElementById('setupinstructions-maillink').style.display = maillink ? 'block' : 'none';
  document.getElementById('defaultcontentformat-custom-wrapper').style.display = custom ? 'block' : 'none';
}

function initSettings() {
  loadAPIToken().then(token => {
    document.getElementById('apitoken').value = token || '';
    if (token) {
      fillAllProjectsSelect('defaultproject');
    }
  });
  loadDefaultDue().then(res => {
    document.getElementById('defaultdue').value = res;
  });
  loadDefaultContentFormat().then(res => {
    const element = document.getElementById('defaultcontentformat');
    element.value = res;
    if (element.value !== res) {
      element.value = 'custom';
      document.getElementById('defaultcontentformat-custom').value = res;
    }
    updateCustomTaskFormat();
  })
  loadIncludeMessageBody().then(res => {
    document.getElementById('include_message_body').checked = res;
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
  document.getElementById('defaultdue').addEventListener('change', saveSettings);
  document.getElementById('defaultcontentformat').addEventListener('change', saveSettings);
  document.getElementById('defaultcontentformat-custom').addEventListener('change', saveSettings);
  document.getElementById('include_message_body').addEventListener('change', saveSettings);
  
  document.getElementById('defaultcontentformat').addEventListener('change', updateCustomTaskFormat);
  initSettings();
});
