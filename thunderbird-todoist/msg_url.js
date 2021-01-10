/* global ChromeUtils */

const { ExtensionCommon } = ChromeUtils.import('resource://gre/modules/ExtensionCommon.jsm');
const { ExtensionAPI } = ExtensionCommon;

this.msgUrl = class extends ExtensionAPI {
  getAPI(context) { // eslint-disable-line class-methods-use-this
    return {
      msgUrl: {
        async url(tabId) {
          const { extension } = context;
          const { tabManager } = extension;

          const tab = tabManager.get(tabId);
          const { window } = tab;

          const hdr = window.gFolderDisplay.selectedMessage;
          const url = hdr.folder.getUriForMsg(hdr);

          return { url };
        },
      },
    };
  }
};
