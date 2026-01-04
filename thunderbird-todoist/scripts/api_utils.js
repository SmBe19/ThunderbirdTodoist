function doRequest(endpoint, config) {
  return loadAPIToken().then((token) => {
    config.headers = {
      Authorization: "Bearer " + token,
    };
    if (config.body) {
      config.headers["Content-Type"] = "application/json";
    }
    return window
      .fetch("https://api.todoist.com/api/v1/" + endpoint, config)
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

function requestGetAllResults(endpoint) {
  let results = [];

  function handlePage(current_endpoint) {
    return requestGet(current_endpoint).then((res) => {
      results = results.concat(res.results);
      if (res.next_cursor) {
        return handlePage(endpoint + "?cursor=" + res.next_cursor);
      }
      return results;
    });
  }
  return handlePage(endpoint);
}

function requestPost(endpoint, data) {
  return doRequest(endpoint, { method: "post", body: JSON.stringify(data) });
}

function getAllProjects() {
  return requestGetAllResults("projects").then((res) => {
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
  let labels = [];
  content = content.replace(/(\s)@(\S+)/g, function (match, p1, p2) {
    labels.push(p2);
    return p1;
  });
  return requestPost("tasks", {
    content: content,
    description: messageContent,
    due_string: due,
    project_id: projectid,
    labels: labels,
  });
}
