function getSelectedProject(projectid) {
  const projects = document.getElementById(projectid);
  if (projects.options[projects.selectedIndex]) {
    return projects.options[projects.selectedIndex].value;
  }
  return "";
}

function getSelectedCollaborator(collabid) {
  const collaborators = document.getElementById(collabid);
  if (collaborators.options[collaborators.selectedIndex]) {
    return collaborators.options[collaborators.selectedIndex].value;
  }
  return "";
}

function fillAllProjectsSelect(projectselect) {
  loadDefaultProject().then((selected) => {
    getAllProjects()
      .then((projects) => {
        function process(proj, indent) {
          let option = document.createElement("option");
          let text = "";
          for (let i = 0; i < indent; i++) {
            text += "&nbsp;&nbsp;&nbsp;";
          }
          option.innerHTML = text + proj.name;
          option.value = proj.id;
          if (proj.id == selected) {
            option.selected = true;
          }
          el.add(option);
          proj.childs.forEach((child) => {
            process(child, indent + 1);
          });
        }
        const el = document.getElementById(projectselect);
        el.innerHTML = "";
        projects.forEach((proj) => {
          process(proj, 0);
        });
      })
      .catch((err) => {
        const el = document.getElementById(projectselect);
        el.innerHTML =
          '<option value="0">Could not connect to Todoist...</option>';
      });
  });
}

function fillAllCollaboratorsSelect(collaboratorselect, projectid) {
  loadDefaultCollaborator().then((selected) => {
    getAllCollaborators(projectid)
      .then((collaborators) => {
        function process(collaborator, indent) {
          let option = document.createElement("option");
          let text = "";
          for (let i = 0; i < indent; i++) {
            text += "&nbsp;&nbsp;&nbsp;";
          }
          option.innerHTML = text + collaborator.name;
          option.value = collaborator.id;
          if (collaborator.id == selected) {
            option.selected = true;
          }
          el.add(option);
        }
        const el = document.getElementById(collaboratorselect);
        el.innerHTML = "";
        let arrayEmpty = true;
        Object.values(collaborators).forEach((collaborator) => {
          process(collaborator, 0);
          arrayEmpty = false;
        });
        if (arrayEmpty) {
          el.innerHTML =
          '<option value="0">No collaborators in this project</option>';  
        }
      })
      .catch((err) => {
        const el = document.getElementById(collaboratorselect);
        el.innerHTML =
          '<option value="0">Could not connect to Todoist...</option>';
      });
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

function formatDefaultTaskContent(message) {
  function twoDigits(num) {
    if (num < 10) {
      return "0" + num;
    }
    return num;
  }

  return loadDefaultContentFormat().then((contentFormat) =>
    contentFormat
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
      .replace("%msgurl%", "mid:" + message.headerMessageId)
  );
}

function addTaskFromMessage(contentid, dueid, projectid, collaboratorid, includebodyid, failid) {
  const content = document.getElementById(contentid).value;
  const due =
    document.getElementById(dueid).value ||
    document.getElementById(dueid).placeholder;
  const project = getSelectedProject(projectid);
  const assignee = getSelectedCollaborator(collaboratorid) || null;
  const includeMessageBody = includebodyid
    ? document.getElementById(includebodyid).checked
    : false;
  Promise.resolve()
    .then(() => {
      if (includeMessageBody) {
        return getDisplayedMessage().then(([message]) =>
          findMessageBody(message.id)
        );
      } else {
        return "";
      }
    })
    .then((messageContent) => addTask(content, due, project, assignee, messageContent))
    .then((res) => {
      window.close();
    })
    .catch((err) => {
      console.error("Adding task failed: ", err)
      document.getElementById(failid).innerHTML = "Adding Task failed...";
    });
}
