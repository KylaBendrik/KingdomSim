const {app, BrowserWindow} = require('electron');

const Window = {
    create() {
        const win = new BrowserWindow({ width: 1460, height: 826});

        win.loadFile('index.html');
        win.webContents.openDevTools();
    }
};

app.on('ready', Window.create);