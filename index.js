const {app, BrowserWindow} = require('electron');

const Window = {
    create() {
        const win = new BrowserWindow({ width: 800, height: 600});

        win.loadFile('index.html');
    }
};

app.on('ready', Window.create);