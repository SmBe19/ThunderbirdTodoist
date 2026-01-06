function getSelectedValue(selectid) {
  const values = document.getElementById(selectid);
  if (values.options[values.selectedIndex]) {
    return values.options[values.selectedIndex].value;
  }
  return "";
}

function fillAllProjectsSelect(selectid) {
  function applyProjects(projects, defaultProjectId) {
    function process(proj, indent) {
      let option = document.createElement("option");
      let text = "";
      for (let i = 0; i < indent; i++) {
        text += "&nbsp;&nbsp;&nbsp;";
      }
      option.innerHTML = text + proj.name;
      option.value = proj.id;
      if (proj.id == defaultProjectId) {
        option.selected = true;
      }
      el.add(option);
      proj.children.forEach((child) => {
        process(child, indent + 1);
      });
    }
    const el = document.getElementById(selectid);
    el.innerHTML = "";
    projects.forEach((proj) => {
      process(proj, 0);
    });
  }
  loadDefaultProject().then((defaultProjectId) => {
    browser.storage.local.get("cachedprojects").then((res) => {
      if (res.cachedprojects) {
        applyProjects(JSON.parse(res.cachedprojects), defaultProjectId);
      }
      getAllProjects()
        .then((projects) => {
          if (JSON.stringify(projects) === res.cachedprojects) {
            return;
          }
          browser.storage.local.set({
            cachedprojects: JSON.stringify(projects),
          });
          applyProjects(projects, defaultProjectId);
        })
        .catch((err) => {
          console.error("Getting projects failed", err);
          const el = document.getElementById(selectid);
          el.innerHTML =
            '<option value="0">Could not connect to Todoist...</option>';
        });
    });
  });
}

function fillAssigneeSelect(selectid, projectId) {
  return getProjectCollaborators(projectId)
    .then((collaborators) => {
      const el = document.getElementById(selectid);
      el.style.display = collaborators.length > 1 ? "" : "none";
      el.innerHTML = "";
      let unassignedOption = document.createElement("option");
      unassignedOption.text = "Unassigned";
      unassignedOption.selected = true;
      unassignedOption.value = "";
      el.add(unassignedOption);
      collaborators.forEach((collab) => {
        let option = document.createElement("option");
        option.text = collab.name;
        option.value = collab.id;
        el.add(option);
      });
    })
    .catch((err) => {
      console.error("Getting collaborators failed", err);
      const el = document.getElementById(selectid);
      el.style.display = "none";
    });
}

function getDisplayedMessage() {
  return browser.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .then((tabs) =>
      browser.messageDisplay
        .getDisplayedMessage(tabs[0].id)
        .then((message) => [message, tabs[0].id])
    );
}

function findMessageBody(messageId) {
  function traversePart(part, contentType) {
    if (part.contentType.toLowerCase() === contentType) {
      return part.body;
    }
    for (currentPart of part.parts || []) {
      const result = traversePart(currentPart, contentType);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return browser.messages
    .getFull(messageId)
    .then(
      (fullMessage) =>
        traversePart(fullMessage, "text/plain") ||
        traversePart(fullMessage, "text/html")
    );
}

function formatStringWithMessage(format, message) {
  function twoDigits(num) {
    if (num < 10) {
      return "0" + num;
    }
    return num;
  }

  const easyReplaced = format
    .replace("%author%", message.author)
    .replace("%subject%", message.subject)
    .replace("%date-Y%", message.date.getFullYear())
    .replace("%date-M%", message.date.getMonth() + 1)
    .replace("%date-D%", message.date.getDate())
    .replace("%date-h%", message.date.getHours())
    .replace("%date-m%", message.date.getMinutes())
    .replace("%date-s%", message.date.getSeconds())
    .replace("%date-YYYY%", message.date.getFullYear())
    .replace("%date-MM%", twoDigits(message.date.getMonth() + 1))
    .replace("%date-DD%", twoDigits(message.date.getDate()))
    .replace("%date-hh%", twoDigits(message.date.getHours()))
    .replace("%date-mm%", twoDigits(message.date.getMinutes()))
    .replace("%date-ss%", twoDigits(message.date.getSeconds()))
    .replace("%msgid%", message.headerMessageId)
    .replace("%msgurl%", "mid:" + message.headerMessageId);
  if (easyReplaced.includes("%body%")) {
    return findMessageBody(message.id).then((body) =>
      easyReplaced.replace("%body%", body.trim())
    );
  } else {
    return Promise.resolve(easyReplaced);
  }
}

function formatDefaultTaskContent(message) {
  return loadDefaultContentFormat().then((contentFormat) =>
    formatStringWithMessage(contentFormat, message)
  );
}

function formatDefaultTaskContentDescription(message) {
  return loadDefaultContentFormatDescription().then((contentFormat) =>
    formatStringWithMessage(contentFormat, message)
  );
}

function addTaskFromMessage(
  contentid,
  dueid,
  selectid,
  assigneeid,
  descriptionid,
  includebodyid,
  failid
) {
  const content = document.getElementById(contentid).value;
  const due =
    document.getElementById(dueid).value ||
    document.getElementById(dueid).placeholder;
  const project = getSelectedValue(selectid);
  const assignee = getSelectedValue(assigneeid);
  const rawDescription = document.getElementById(descriptionid).value;
  const includeMessageBody = includebodyid
    ? document.getElementById(includebodyid).checked
    : false;
  Promise.resolve()
    .then(() => {
      if (includeMessageBody) {
        return getDisplayedMessage()
          .then(([message]) => findMessageBody(message.id))
          .then((body) => {
            if (rawDescription) {
              return rawDescription + "\n\n" + body;
            } else {
              return body;
            }
          });
      } else {
        return rawDescription;
      }
    })
    .then((description) =>
      addTask(content, due, project, assignee, description)
    )
    .then((res) => {
      window.close();
    })
    .catch((err) => {
      console.error("Adding task failed: ", err);
      document.getElementById(failid).innerHTML = "Adding Task failed...";
    });
}
