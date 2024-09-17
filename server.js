const { exec } = require("node:child_process")
const express = require("express")
const app = express()
const PORT = 3287

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

function isRunning(query, cb) {
    let platform = process.platform
    let cmd = ""
    switch (platform) {
        case "win32" : cmd = `tasklist`; break
        default: break
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1)
    })
}

app.get("/", (req, res) => {
    if (!isRunning("Unowhy Breaker.exe")) {
        runCommand("C:\\Program Files\\Sweven\\Unowhy Breaker\\Unowhy Breaker.exe --adminProcess")
        res.status.json({ success: true })
    } else {
        res.json({ error: { code: 409, message: "Unowhy Breaker est déjà en cours d'exécution" } })
    }
})

app.listen(PORT, () => {
    console.log("Server running at port : " + PORT)
})