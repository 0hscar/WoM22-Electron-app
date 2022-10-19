/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const { ipcRenderer } = require("electron")
const { main } = require("json")





var cabinButton = document.getElementById('cabinClick')
var servicesButton = document.getElementById('servicesClick')
var bothButton = document.getElementById('bothClick')

bothButton.addEventListener('click', (event) => {
    showBoth()
    
})
servicesButton.addEventListener('click', (event) => {
    showServices()
})
cabinButton.addEventListener('click', (event) => {
    showCabin()
})


async function getServices(){
    servicelist = []

    const services = await window.Electron.getServices()

    options =""
    for (i=0; i<services.Electron;i++){
        options += "<option value="+services[i].id+">"+services[i].service+"</option"
    }
    return options
}





function showCabin(){
    document.querySelector('#cabins').style.display = "block"
    document.querySelector('#services').style.display = "none"

}

function showServices(){
    document.querySelector('#services').style.display = "block"
    document.querySelector('#cabins').style.display = "none"
    


}

function showBoth(){
    document.querySelector('#services').style.display = "block"
    document.querySelector('#cabins').style.display = "block"
    
    
}





