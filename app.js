const { app, BrowserWindow, ipcMain } = require("electron")
const { exec } = require("node:child_process")
const path = require("node:path")
let win

function runCommand(command, cwd = "") {
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

function createInstallerWindow() {
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
    createInstallerWindow()
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createInstallerWindow()
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
        case "installUB":
            try {
                const exePath = "X:\\Program Files\\Unowhy Breaker\\bin\\Unowhy Breaker\\resources\\app\\Unowhy Breaker Server.exe"
                console.log("Copie des fichiers en cours...")
                await runCommand(`xcopy "${path.parse(exePath).dir}" "C:\\Program Files\\Sweven\\Unowhy Breaker" /E /I /H /Y`)
                console.log("Copie des fichiers effectuée")
                console.log("Création du service d'exécution")
                console.log("Chargement de l'éditeur de registre")
                await runCommand("reg load HKLM\\Offline-SYSTEM C:\\Windows\\System32\\Config\\SYSTEM")
                console.log("Chargement effectué")
                console.log("Ajout du service")
                await runCommand(`reg add "HKLM\\Offline-SYSTEM\\CurrentControlSet\\Services\\UnowhyBreakerService" /v "${exePath}" /t REG_EXPAND_SZ /d ""${exePath}"" /f`)
                await runCommand(`reg add "HKLM\\Offline-SYSTEM\\CurrentControlSet\\Services\\UnowhyBreakerService" /v "Start" /t REG_DWORD /d 2 /f`)
                await runCommand(`reg add "HKLM\\Offline-SYSTEM\\CurrentControlSet\\Services\\UnowhyBreakerService" /v "Type" /t REG_DWORD /d 10 /f`)
                await runCommand(`reg add "HKLM\\Offline-SYSTEM\\CurrentControlSet\\Services\\UnowhyBreakerService" /v "DisplayName" /t REG_SZ /d "Unowhy Breaker Service" /f`)
                console.log("Service ajouté")
                console.log("Déchargement de l'éditeur de registre")
                await runCommand("reg unload HKLM\\Offline-SYSTEM")
                console.log("Déchargement effectué")
            } catch (error) {
                console.log(error)
            }
            break
        case "replaceSethcByCmd":
            try {
                await runCommand(`del C:\\Windows\\System32\\sethc.exe`)
                await runCommand(`xcopy "C:\\Windows\\System32\\cmd.exe" "C:\\Windows\\System32\\sethc.exe" /E /I /H /Y`)
            } catch (error) {
                console.log(error)
            }
            break
        case "removeHiSqool":
            try {
                await runCommand("rmdir /s /q  \"Unowhy\"", "C:\\Program Files")
                win.webContents.executeJavaScript("alert('HiSqool Supprimé !')")
            } catch (error) {
                console.log(error)
            }
        case "exit":
            try {
                await runCommand("wpeutil reboot", "X:\\Program Files\\Unowhy Breaker")
            } catch (error) {
                console.log(error)
            }
            break
    }
})