function doRequest(endpoint, config) {
  return loadAPIToken().then((token) => {
    config.headers = {
      Authorization: "Bearer " + token,
    };
    if (config.body) {
      config.headers["Content-Type"] = "application/json";
    }
    return window
      .fetch("https://api.todoist.com/rest/v2/" + endpoint, config)
      .then((res) => {
        if (!res.ok) {
          console.log("Error with request to " + endpoint + ": ", res);
          return Promise.reject();
        }
        return res.json();
      });
  });
}

function requestGet(endpoint) {
  return doRequest(endpoint, { method: "get" });
}

function requestPost(endpoint, data) {
  return doRequest(endpoint, { method: "post", body: JSON.stringify(data) });
}

function getAllProjects() {
  return requestGet("projects").then((res) => {
    let projects = {};
    let roots = [];
    res.forEach((proj) => {
      projects[proj.id] = proj;
      proj.childs = [];
    });
    res.forEach((proj) => {
      if (proj.parent_id) {
        projects[proj.parent_id].childs.push(proj);
      } else {
        roots.push(proj);
      }
    });
    return roots;
  });
}

function addTask(content, due, projectid, messageContent) {
  return requestPost("tasks", {
    content: content,
    description: messageContent,
    due_string: due,
    project_id: projectid,
  });
}
