var { ExtensionCommon } = ChromeUtils.import(
  "resource://gre/modules/ExtensionCommon.jsm"
);

var msgurl = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      msgurl: {
        async url(tabId) {
          const tab = context.extension.tabManager.get(tabId);
          const msg = tab.window.gFolderDisplay.selectedMessage;
          const url = msg.folder.getUriForMsg(msg);

          return { url };
        },
      },
    };
  }
};
