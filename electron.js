try {
    require("electron-reloader")(module);
} catch (_) {
    console.log(_);
}

const electron = module.exports;
const path = require("path");

const {app, BrowserWindow, ipcMain, ipcRenderer, Menu, WebContents} = require("electron");

const { saveDataFile } = require('./store')

electron.ipcRenderer = ipcRenderer;

let win;
let ses;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    ses = win.webContents.session;
    ipcMain.handle('getUserDataDir', () => {
        return app.getPath('userData')
    });

    win.loadFile("index.html");
};

app.whenReady().then(() => {
    createWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Menu template
const menu = [
    {
        label: 'App',
        submenu: [
            {
                label: 'Clear Mirror Cache',
                click: async () => {
                    await saveDataFile(app.getPath('userData'), {});
                }
            },
            {
                label: 'Reload',
                click: () => {
                    BrowserWindow.getFocusedWindow().reload();
                },
                accelerator: 'CmdOrCtrl+R'
            },
            {
                label: 'Quit',
                click: () => app.quit(),
                accelerator: 'CmdOrCtrl+Q'
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Zoom Out',
                click: () => {
                    const contents = win.webContents;
                    contents.zoomLevel -= 0.5;
                },
                accelerator: 'CmdOrCtrl+-'
            },
            {
                label: 'Zoom In',
                click: () => {
                    const contents = win.webContents;
                    contents.zoomLevel += 0.5;
                },
                accelerator: 'CmdOrCtrl+='
            },
            {
                label: 'Reset Zoom',
                click: () => {
                    const contents = win.webContents;
                    contents.zoomLevel = 0;
                },
                accelerator: 'CmdOrCtrl+0'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'App Homepage',
                click: () => {
                    require('electron').shell.openExternal('https://fardinkamal62.github.io/projects/mime');
                }
            },
            {
                label: 'Report Issue',
                click: () => {
                    require('electron').shell.openExternal('http://github.com/fardinkamal62/fedora-mirror-measure/issues/');
                }
            },
            {
                label: 'Developer Information',
                click: () => {
                    require('electron').shell.openExternal('http://fardinkamal62.github.io')}
            }
        ]
    }
]

app.on('before-quit', () => {
    // Clear the cache
    ses.clearCache(() => {});
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
