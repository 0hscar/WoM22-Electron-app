// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default
const json = require('json')

function createWindow (pageName) {
  // Create the browser window.
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), nodeIntegration: true, contextIsolation: false, allowRunningInsecureContent: true, enableBlinkFeatures: 'ExecCommandInJavaScript'
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(pageName)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  let pageName = 'login.html'
  createWindow(pageName)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(pageName)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


let dice = 6
let sides = 6

// fetch('http://localhost:4000/graphql', {
//   method: 'POST',
//   headers: {
//     'Content-type': 'application/json',
//     'Accept': 'application/json',
//   },
//   body: JSON.stringify({
//     query,
//     variables: {dice, sides},
//   })
// })
//   .then(r => r.json())
//   .then(data => console.log('data returned', data))



  fetch('http://localhost:4000/graphql',{
    method: 'POST',
    headers: {
      'Content-type': 'Application/json',
      'Accept': 'application/json'
    }
  })
  .then(r => r.json())
  .then(data => console.log('data returned:', data))

// console.log(fetch('http://localhost:4000/graphql').then(r => r.json))

// async function test(){
//   await fetch('http://localhost:4000/graphql')
//   result = await response.json()
//   console.log(result)

// }







// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
