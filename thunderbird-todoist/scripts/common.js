function loadAPIToken() {
  return browser.storage.local.get('apitoken').then(res => res.apitoken);
}

function loadDefaultProject() {
  return browser.storage.local.get('defaultproject').then(res => res.defaultproject);
}

function loadMaillink() {
  return browser.storage.local.get('maillink').then(res => res.maillink === '1');
}

function loadIncludeMessageBody() {
  return browser.storage.local.get('includeMessageBody').then(res => res.fwdContent === '1');
}

function showSettingsIfNecessary() {
  loadAPIToken().then(token => {
    console.log(token, token.length);
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

function addTask(content, due, projectid, messageContent) {
  return requestPost('tasks', {
    content: content,
    description: messageContent,
    due_string: due,
    project_id: parseInt(projectid, 10),
  });
}
