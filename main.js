const { app, BrowserWindow, session, ipcMain } = require('electron')
const { readFileSync } = require('fs-extra')
const path = require('path')

const loginKey = 'QY-16-WAN-0668-2555555-7ROAD-dandantang-trminhpc773377'

// region Initalize plugins
let _CONFIG = {}
const getConfig = () => {
  const configDir = path.join(app.getAppPath(), 'config.json')
  try {
    const data = readFileSync(configDir, 'utf8')
    const config = {
      ...JSON.parse(data),
      loginKey
    }
    _CONFIG = config
    return config
  } catch (error) {
    console.log('error', error)
    throw new Error('Config file not found.')
  }
}

let pluginName = null
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    app.commandLine.appendSwitch('no-sandbox')
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    break
}
const pluginPath = path.join(
  __dirname.includes('.asar') ? process.resourcesPath : __dirname,
  'plugins/' + pluginName
)

console.log('pluginPath', pluginPath)

app.commandLine.appendSwitch('disable-renderer-backgrounding')
if (process.platform !== 'darwin') {
  app.commandLine.appendSwitch('high-dpi-support', '1')
  //app.commandLine.appendSwitch('force-device-scale-factor', "1");
  app.commandLine.appendSwitch('--enable-npapi')
}
app.commandLine.appendSwitch('ppapi-flash-path', pluginPath)
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
app.commandLine.appendSwitch('allow-insecure-localhost', 'true')
app.commandLine.appendSwitch('incognito')
// endregion

// region IPCs
ipcMain.on('toPlay', (event, arg) => {
  let window = windows?.[arg.windowIndex]
  if (!!window && !window.isDestroyed()) {
    playWindow = createPlayWindow()
    window.close()
  }
})

ipcMain.handle('getConfig', () => {
  return getConfig()
})
// endregion

// region Global Variables
let windows = {}
// endregion

const createLoginWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload/login.js')
    }
  })
  window.loadFile('renderer/login.html')
  windows['login'] = window
  return window
}

const createPlayWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      webviewTag: true,
      plugins: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload/play.js')
    }
  })
  window.loadFile('renderer/play.html')
  window.maximize()
  windows['play'] = window
  window.webContents.openDevTools()
  return window
}

app.whenReady().then(() => {
  const config = getConfig()
  const filter = {
    urls: [`${config.request}*`, `${config.flash}*`, `${config.config}*`]
  }
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } })
  })
  session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        // We use this to bypass headers
        'Access-Control-Allow-Headers': ['*'],
        ...details.responseHeaders
      }
    })
  })

  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
