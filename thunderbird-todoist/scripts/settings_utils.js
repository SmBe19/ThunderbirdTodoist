function loadAPIToken() {
  return browser.storage.local.get('apitoken').then(res => res.apitoken);
}

function loadDefaultProject() {
  return browser.storage.local.get('defaultproject').then(res => res.defaultproject);
}

function loadDefaultDue() {
  return browser.storage.local.get('defaultdue').then(res => res.defaultdue || "Today");
}

function loadDefaultContentFormat() {
  return browser.storage.local.get('defaultcontentformat').then(res => res.defaultcontentformat || "Mail by %author%: %subject%");
}

function loadIncludeMessageBody() {
  return browser.storage.local.get('includeMessageBody').then(res => res.includeMessageBody === '1');
}

function showSettingsIfNecessary() {
  loadAPIToken().then(token => {
    if (!token || token.length < 40) {
      // TODO does not work...
      browser.runtime.openOptionsPage();
    }
  });
}
