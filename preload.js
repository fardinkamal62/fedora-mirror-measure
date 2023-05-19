const {contextBridge, ipcRenderer} = require("electron");
const os = require("os");
const {exec} = require("node:child_process");

const {getMirrors} = require("./mirror");
const {saveDataFile, parseDataFile} = require("./store");
const {main, checkRelease, stop} = require("./speedtest");

contextBridge.exposeInMainWorld("sysinfo", {
    arch: () => os.arch(),
    version: () => {
        if (os.platform() === "linux") {
            return new Promise((resolve, reject) => {
                exec(
                    "cat /etc/*release | grep -E ^VERSION=",
                    function (error, stdout, stderr) {
                        if (!stderr && !error) {
                            const version = stdout.match(/[0-9]/g).join('')
                            resolve(version);
                        } else {
                            reject('Other');
                        }
                    }
                );
            });
        } else {
            return "Other";
        }
    },
});

contextBridge.exposeInMainWorld("mirrorInfo", {
    get: async (version, archi) => {
        return await getMirrors(version, archi);
    },
});

contextBridge.exposeInMainWorld("store", {
    store: async (data, version, archi) => {
        const dir = await ipcRenderer.invoke('getUserDataDir')
        return await saveDataFile(dir, data, version, archi);
    },
    fetch: async () => {
        const dir = await ipcRenderer.invoke('getUserDataDir')
        return await parseDataFile(dir)
    }
});

contextBridge.exposeInMainWorld("speedtest", {
    main: async (url, version, ostm, archi) => {
        return await main(url, version, ostm, archi);
    },
    checkRelease: async (ostm, archi) => {
        return await checkRelease(ostm, archi)
    },
    stop: () => {
        stop()
    },
});
