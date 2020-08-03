'use strict'

// Import parts of electron to use
const { app, BrowserWindow, ipcMain } = require('electron')
const { ipcRenderer } = require('electron')
const { session } = require('electron')

const path = require('path')
const url = require('url')

// creating 
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@2tGSN6nmBRXTzq',
  database: 'slawpharmacy'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Keep a reference for dev mode
let dev = false


if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}


if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  let indexPath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8081',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath)
  mainWindow.removeMenu()

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {

    session.defaultSession.clearStorageData({
      // without set origin options
      storages: ['localstorage', 'caches', 'indexdb']
    }, () => {
      console.log("local deleted");

    })

    connection.end(function(err) {
      // The connection is terminated now
    });

    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

connection.connect(function (err) {
  if (err) {
    console.log('connect', err);
  }
});

ipcMain.on('query', function (event, sql) {

  // console.log('query received', sql);

  connection.query(sql, function (err, rows, fields) {
    if (err) {
      console.log('error executing', err);
      return false;
    }
    else {
      // console.log(rows);

      // event.reply('result', rows)
      event.returnValue = rows

    }

  });

});

ipcMain.on('queryWithArg', function (event, sql, para) {

  // console.log('query received', sql, para);

  connection.query(sql, para, function (err, rows, fields) {
    if (err) {
      console.log('error executing', err);
      return false;
    }
    else {
      // console.log(rows);
      // event.reply('resultwithPara', rows)
      event.returnValue = rows
    }

  });

});

// backup 
const CronJob = require('cron/lib/cron.js').CronJob;
const { exec } = require("child_process");

const oneDrivePath = process.env.OneDrive
const PublicKey = process.env.PublicKey

const job = new CronJob('24 22 * * * *', function () {

  const d = new Date();

  exec(`mysqldump --login-path=local  --routines --events --triggers --single-transaction slawpharmacy |` +
    ` openssl smime -encrypt -binary -text -aes256  -outform DER ${PublicKey} | gzip > ${oneDrivePath}/Backup.gz `, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

    });


}, null, true);



