const {
  app,
  contextBridge,
  ipcRenderer,
  shell
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "remote", {
      send: (channel, ...args) => {
        ipcRenderer.send(channel, ...args);
      },
      receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      },
      once: (channel, func) => {
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      },
      invoke: (channel, ...args) => {
        return ipcRenderer.invoke(channel, ...args);
      },
      openDefaultBrowser: (url) => {
        shell.openExternal(url); 
      },
      isProduction: () => {
        app.isPackaged;
      }
  }
);