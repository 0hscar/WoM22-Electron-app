// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default
const json = require('json')
var { buildSchema } = require('graphql');
var express = require('express')
var { graphqlHTTP } = require('express-graphql');
const { resourceUsage } = require('process');


const createWindow = () => {
  const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js')
      },
      autoHideMenuBar: true //ALT
  })

  win.loadFile(path.join(__dirname, 'login.html'))
  win.webContents.openDevTools()
}

app.on('ready', createWindow)


// Projekt 1 Driftsätningen fungerade inte --> måste skippa log in 
ipcMain.handle('login-handler', async (event, data) => {
  
  try{
      const response = await fetch("https://weber-wom22-proj1.azurewebsites.net", data)
      login = await response.json()
      console.log(login)
      return login
  } catch (error) {
      return error.message
  }
})

ipcMain.handle('getcabins-handler', async (event, data) => {
  try{
          const response = await fetch('https://striking-finch-42.hasura.app/api/rest/getCabins', data)
      
          cabins = await response.json()
          return cabins
  } catch (error) {
      return error.message
  }
})

ipcMain.handle('makeorder-handler', async (event, data) => {
  console.log("Placing order!")
  try{
      // console.log(data)
      const response = await fetch('https://striking-finch-42.hasura.app/v1/graphql', data)
      // Har en skild endpoint för delete med premade query men ville inte få variables passed med något annat än POST, Samma för delete av en order
      order = await response.json()
      // console.log(order)
      return order

  } catch (error) {
      return error.message
  }
})

ipcMain.handle('deleteorder-handler', async (event, data) => {
  console.log("Deleting order!")
  try{
      // console.log(data)
      // req = {
      //     method: 'DELETE',
      //     header: {
      //         'Content-type': 'application/json',
      //         'x-hasura-admin-secret': 'JbQCUuobnSIqZXdq1ckgFoe5wyRuYTBskozBeNlWOgpeUjkMTVzdNEgPSktSOlSg',
      //     }
      // }
      // const response = await fetch('https://striking-finch-42.hasura.app/api/rest/orders/:id=' + data, req)
      // Olika test för att göra det med en egen endpoint men lyckades inte passa variablerna så blev improvisering
      const response = await fetch('https://striking-finch-42.hasura.app/v1/graphql', data)
  
      order = await response.json()
      // console.log(order)
      return order

  } catch (error) {
      return error.message
  }
})

ipcMain.handle('getorders-handler', async (event, data) => {
  try{
          const response = await fetch('https://striking-finch-42.hasura.app/api/rest/getOrders', data)
      
          orders = await response.json()
          return orders
  } catch (error) {
      return error.message
  }
})

ipcMain.handle('getservices-handler', async (event, data) => {
  try{
          const response = await fetch('https://striking-finch-42.hasura.app/api/rest/getAllServices',data)
      
          services = await response.json()
          return services
  } catch (error) {
      return error.message
  }
})







// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
