const { compile } = require("nexe")
const path = require("path")

async function main() {
    try {
        await compile({
            input: path.join(__dirname, "server.js"),
            ico: path.join(__dirname, "symbol", "icon.ico"),
            build: true,
            targets: [
                {
                    platform: "windows",
                    arch: "x64"
                }
            ]
        })
    } catch (error) {
        console.log(error)
    }
}

main()