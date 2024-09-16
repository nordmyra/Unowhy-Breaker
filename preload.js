const { ipcRenderer, contextBridge } = require("electron")

contextBridge.exposeInMainWorld("breaker", {
    send: (action) => {
        ipcRenderer.send("action", { action })
    }
})