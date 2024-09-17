const { exec } = require("node:child_process")
const path = require("node:path")
const rcedit = require("rcedit")
const fs = require("fs")

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

async function build() {
    try {
        await runCommand(`pkg server.js -t node16-win-x64 --out-path "${path.join(__dirname, "pkg-dist")}"`)
        await runCommand(`move "${path.join(__dirname, "pkg-dist", "server.exe")}" "${path.join(__dirname, "pkg-dist", "Unowhy Breaker Server.exe")}"`)
        rcedit(path.join(__dirname, "pkg-dist", "Unowhy Breaker Server.exe"), {
            icon: path.join(__dirname, "symbol", "icon.ico")
        })
    } catch (error) {
        if (fs.existsSync(path.join(__dirname, "pkg-dist", "server.exe"))) {
            await runCommand(`move "${path.join(__dirname, "pkg-dist", "server.exe")}" "${path.join(__dirname, "pkg-dist", "Unowhy Breaker Server.exe")}"`)
            rcedit(path.join(__dirname, "pkg-dist", "Unowhy Breaker Server.exe"), {
                icon: path.join(__dirname, "symbol", "icon.ico")
            })
        } else {
            console.log(error)
        }
    }
}

build()