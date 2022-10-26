/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */


 const { ipcRenderer, contextBridge } = require('electron')

 contextBridge.exposeInMainWorld('electron', {
 
     
     
     login: async (data) => {
 
         return await ipcRenderer.invoke('login-handler', data)
     },
 
     getCabins: async (data) => {
 
         return await ipcRenderer.invoke('getcabins-handler', data)
     },
 
     makeOrder: async (data) => {
 
         return await ipcRenderer.invoke('makeorder-handler', data)
     },
 
     deleteOrder: async (data) => {
         console.log("Preloading delete order!")
 
         return await ipcRenderer.invoke('deleteorder-handler', data)
     },
 
     getOrders: async (data) => {
 
         return await ipcRenderer.invoke('getorders-handler', data)
     },
 
     getServices: async (data) => {
 
         return await ipcRenderer.invoke('getservices-handler', data)
     }
 })