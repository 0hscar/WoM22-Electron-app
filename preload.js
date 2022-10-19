/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */


const { ipcRenderer, contextBridge } = require('electron')



window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})




contextBridge.exposeInMainWorld('electron', {

    
    
    login: async (data) => {

        return await ipcRenderer.invoke('login-handler', data)
    },

    getCabins: async (data) => {

        return await ipcRenderer.invoke('getCabins-handler', data)
    },

    makeOrder: async (data) => {

        return await ipcRenderer.invoke('makeorder-handler', data)
    },

    deleteOrder: async (data) => {
        console.log("Preloading delete order!")

        return await ipcRenderer.invoke('deleteorder-handler', data)
    },

    getMyOrders: async (data) => {

        return await ipcRenderer.invoke('getmyorders-handler', data)
    },

    getServices: async (data) => {

        return await ipcRenderer.invoke('getServices-handler', data)
    }
})