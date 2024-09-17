const { app, BrowserWindow, ipcMain } = require("electron")
const { execSync, exec } = require("node:child_process")
const path = require("node:path")
let win

function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd } , (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`)
                reject(error)
                return
            }
            if (stderr) {
                console.error(`Standard Error: ${stderr}`)
                reject(stderr)
                return
            }
            console.log(`Output: ${stdout}`)
            resolve(stdout)
        })
    })
}

function createWindow () {
    win = new BrowserWindow({
        fullscreen: true,
        minWidth: 900,
        minHeight: 600,
        icon: path.join(__dirname, "symbol", "icon.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.loadFile(path.join(__dirname, "public", "index.html"))
}

app.whenReady().then(() => {
    createWindow()
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})

app.on("browser-window-created", (event, window) => {
    window.removeMenu()
})

ipcMain.on("action", async (event, data) => {
    switch (data.action) {
        case "exit":
            try {
                await runCommand("wpeutil reboot", "X:\\Program Files\\Unowhy Breaker")
            } catch (error) {
                console.log(error)
            }
            break
    }
})