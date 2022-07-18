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

function doRequest(endpoint, config) {
  return loadAPIToken().then(token => {
    config.headers = {
      "Authorization": "Bearer " + token
    };
    if (config.body) {
      config.headers["Content-Type"] = "application/json";
    }
    return window.fetch(
      'https://api.todoist.com/rest/v1/' + endpoint,
      config
    ).then(res => {
      if (!res.ok) {
        console.log('Error with request to ' + endpoint + ': ', res);
        return Promise.reject();
      }
      return res.json();
    });
  });
}

function requestGet(endpoint) {
  return doRequest(endpoint, {method: 'get'});
}

function requestPost(endpoint, data) {
  return doRequest(endpoint, {method: 'post', body: JSON.stringify(data)});
}

function getSelectedProject(selectid) {
  const projects = document.getElementById(selectid);
  if (projects.options[projects.selectedIndex]) {
    return projects.options[projects.selectedIndex].value;
  }
  return '';
}

function getAllProjects() {
  return requestGet('projects').then(res => {
    let projects = {};
    let roots = [];
    res.forEach(proj => {
      projects[proj.id] = proj;
      proj.childs = [];
    });
    res.forEach(proj => {
      if (proj.parent) {
        projects[proj.parent].childs.push(proj);
      } else {
        roots.push(proj);
      }
    });
    return roots;
  });
}

function fillAllProjectsSelect(selectid, selected) {
  loadDefaultProject().then(selected => {
    getAllProjects().then(projects => {
      function process(proj, indent) {
        let option = document.createElement('option');
        let text = '';
        for (let i = 0; i < indent; i++) {
          text += '&nbsp;&nbsp;&nbsp;';
        }
        option.innerHTML = text + proj.name;
        option.value = proj.id;
        if (proj.id == selected) {
          option.selected = true;
        }
        el.add(option);
        proj.childs.forEach(child => {
          process(child, indent+1);
        });
      }
      const el = document.getElementById(selectid);
      el.innerHTML = '';
      projects.forEach(proj => {
        process(proj, 0);
      });
    })
    .catch(err => {
      const el = document.getElementById(selectid);
      el.innerHTML = '<option value="0">Could not connect to Todoist...</option>';
    });
  });
}

function getDisplayedMessage() {
  return browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  .then((tabs) => browser.messageDisplay.getDisplayedMessage(tabs[0].id)
    .then(message => [message, tabs[0].id])
  );
}

function findMessageBody(messageId) {
  function traversePart(part, contentType) {
    if (part.contentType.toLowerCase() === contentType) {
      return part.body;
    }
    for (currentPart of (part.parts || [])) {
      const result = traversePart(currentPart, contentType);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return browser.messages.getFull(messageId).then(fullMessage =>
    traversePart(fullMessage, 'text/plain') || traversePart(fullMessage, 'text/html'));
}

function formatDefaultTaskContent(message, maillink) {
  function twoDigits(num) {
    if (num < 10) {
      return "0" + num;
    }
    return num;
  }

  return loadDefaultContentFormat().then(contentFormat => contentFormat
    .replace("%author%", message.author)
    .replace("%subject%", message.subject)
    .replace("%date-Y%", message.date.getFullYear())
    .replace("%date-M%", message.date.getMonth()+1)
    .replace("%date-D%", message.date.getDate())
    .replace("%date-h%", message.date.getHours())
    .replace("%date-m%", message.date.getMinutes())
    .replace("%date-s%", message.date.getSeconds())
    .replace("%date-YYYY%", message.date.getFullYear())
    .replace("%date-MM%", twoDigits(message.date.getMonth()+1))
    .replace("%date-DD%", twoDigits(message.date.getDate()))
    .replace("%date-hh%", twoDigits(message.date.getHours()))
    .replace("%date-mm%", twoDigits(message.date.getMinutes()))
    .replace("%date-ss%", twoDigits(message.date.getSeconds()))
    .replace("%msgid%", message.headerMessageId)
    .replace("%msgurl%", maillink)
  )
}

function addTaskFromMessage(contentid, dueid, selectid, includebodyid, failid) {
  const content = document.getElementById(contentid).value;
  const due = document.getElementById(dueid).value || document.getElementById(dueid).placeholder;
  const project = getSelectedProject(selectid);
  const includeMessageBody = includebodyid ? document.getElementById(includebodyid).checked : false;
  Promise.resolve().then(() => {
    if (includeMessageBody) {
      return getDisplayedMessage().then(([message]) => findMessageBody(message.id));
    } else {
      return "";
    }
  })
  .then(messageContent => addTask(content, due, project, messageContent))
  .then(res => {
    window.close();
  })
  .catch(err => {
    document.getElementById(failid).innerHTML = 'Adding Task failed...'
  });
}

function addTask(content, due, projectid, messageContent) {
  return requestPost('tasks', {
    content: content,
    description: messageContent,
    due_string: due,
    project_id: parseInt(projectid, 10),
  });
}
