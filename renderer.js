/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

 async function getServices() {
    servicelist = []
    var data = {
        headers: {
            'Content-type': 'application/json',
            'x-hasura-admin-secret': 'JbQCUuobnSIqZXdq1ckgFoe5wyRuYTBskozBeNlWOgpeUjkMTVzdNEgPSktSOlSg',
        }
    }
    const services = await window.electron.getServices(data)
    console.log(services.services)
    options=""
    for(i=0;i<services.services.length;i++){
        options += "<option value="+services.services[i].id+">"+services.services[i].service+"</option>"            
    }
    return options
};

function makeOrderBtn(cabin_id){
    document.querySelector("#order"+cabin_id).addEventListener('click', async () => {
        let service_id = document.querySelector("#services"+cabin_id).value
        let datefield = document.querySelector("#date"+cabin_id)
        order_date = datefield.value
        let id = Math.floor(Math.random() * 100) + cabin_id

        var query = `
            mutation insertOrder($id: Int, $cabin_id: Int, $order_date: String, $service_id: Int) {
                insert_orders(objects: {cabin_id: $cabin_id, id: $id, order_date: $order_date, service_id: $service_id}) {
                returning {
                    cabin_id
                    id
                    order_date
                    service_id
                }
                }
            }
        `
        // Måst bli lite våld query insättning när jag inte lyckades få variabler passed till mina premade endpoints. 
        // console.log(d)
        var data = 
        {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'x-hasura-admin-secret': 'JbQCUuobnSIqZXdq1ckgFoe5wyRuYTBskozBeNlWOgpeUjkMTVzdNEgPSktSOlSg',

            },
            body: JSON.stringify({
                query,
                variables: {id, cabin_id, order_date, service_id}
            }),
            
        }
        const order = await window.electron.makeOrder(data)
            
    });
}

function makeDeleteBtn(id, cabin_id){
    console.log("Making delete button " + id)
    document.querySelector("#delete"+id).addEventListener('click', async () => {
        
        var query = `
            mutation deleteOrder($id: Int, $cabin_id: Int) {
                delete_orders(where: {id: {_eq: $id}, cabin_id: {_eq: $cabin_id}}) {
                    returning {
                        id
                        service_id
                    }
                }
            }
        `
        
        console.log("delete order")
        console.log("Delete " + id)
        var data = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-hasura-admin-secret': 'JbQCUuobnSIqZXdq1ckgFoe5wyRuYTBskozBeNlWOgpeUjkMTVzdNEgPSktSOlSg',
            },
            // Har en skild endpoint för delete med premade query men ville inte få variables passed med något annat än POST 
          
            body: JSON.stringify({
                query,
                variables: {
                    id, cabin_id
                },
            })
        }
        const order = await window.electron.deleteOrder(data)
        console.log(order.orders)
        document.querySelector("#order_"+id).innerHTML = "Deleted"
            
    });
}

cabins = async () => {
    var data = {
        headers: {
            'Content-type': 'application/json',
            'x-hasura-admin-secret': 'JbQCUuobnSIqZXdq1ckgFoe5wyRuYTBskozBeNlWOgpeUjkMTVzdNEgPSktSOlSg',
        }
    }
    const cabinsObject = await window.electron.getCabins(data)

    // console.log(cabinsObject)
    // console.log(cabinsObject.cabins[0].adress)
    services = await getServices()

    
    document.querySelector('#cabins').innerHTML = '<li>'
    
    Object.keys(cabinsObject.cabins).forEach(cabin => {
        
        document.querySelector('#cabins').innerHTML += `
        <div id="${cabinsObject.cabins[cabin].id}">
        <div><h3>${cabinsObject.cabins[cabin].adress}</h3></div>
        <div>Owner: <a href="mailto: ${cabinsObject.cabins[cabin].owner}" >${cabinsObject.cabins[cabin].owner}</a></div>
        
        <div>Size: ${cabinsObject.cabins[cabin].size} m^2</div>
        

        <select id="services${cabinsObject.cabins[cabin].id}" name="services">
        `+services+`
        </select><br>
        <input id="date${cabinsObject.cabins[cabin].id}" type="date" required pattern="\\d{4}-\\d{2}-\\d{2}"><br><br>
        <button class="button-54" id="order${cabinsObject.cabins[cabin].id}">Order</button><br><br>
        </div>
        `
        makeOrderBtn(cabinsObject.cabins[cabin].id)
    })
    document.querySelector('#cabins').innerHTML += '</li>'
    Object.keys(cabinsObject.cabins).forEach(cabin => {
        makeOrderBtn(cabinsObject.cabins[cabin].id)
    })
};


orders = async () => {

    var data = {
        headers: {
            'Content-type': 'application/json',
            'x-hasura-admin-secret': 'JbQCUuobnSIqZXdq1ckgFoe5wyRuYTBskozBeNlWOgpeUjkMTVzdNEgPSktSOlSg',
        }
    }

    const ordersObject = await window.electron.getOrders(data)
    const cabinsObject = await window.electron.getCabins(data)    
    const serviceObject = await window.electron.getServices(data)
    // Nappa in dem alla så ja kunde få adressen och namnet på servicen med i order listan
    console.log(ordersObject)


    // console.log(orders)

    document.querySelector('#orders').innerHTML = '<li>'

    Object.keys(ordersObject.orders).forEach(order => {
        
        console.log(cabinsObject.cabins.find(({id}) => id === ordersObject.orders[order].cabin_id).adress)
        
        let cabinInQuestionAdress = cabinsObject.cabins.find(({id}) => id === ordersObject.orders[order].cabin_id).adress
        let serviceInQuestionService = serviceObject.services.find(({id}) => id === ordersObject.orders[order].service_id).service
        
        // console.log(cabinInQuestionId)
        // console.log(order)
        // console.log(ordersObject.orders[order].cabin_id)
        document.querySelector('#orders').innerHTML += `
        
        <ul id="order_${ordersObject.orders[order].id}">
        <div>Cabin_Id: ${ordersObject.orders[order].cabin_id}
        <h5> Adress: ${cabinInQuestionAdress} </h5></div>
        <div>Service_Id: ${ordersObject.orders[order].service_id}
        <h5> Service Type: ${serviceInQuestionService} </h5></div>
        <div>Date: ${ordersObject.orders[order].order_date}</div>
        <button class="button-54"  id="delete${ordersObject.orders[order].id}">Remove</button><br><br>
        </ul>
        <div class="sep"></div>
        `
    })

    document.querySelector('#orders').innerHTML += '</li>'

    Object.keys(ordersObject.orders).forEach(order => {
        makeDeleteBtn(ordersObject.orders[order].id, ordersObject.orders[order].cabin_id)
        console.log(ordersObject.orders[order].id, ordersObject.orders[order].cabin_id)
    })
};
document.querySelector('#login').style.display = "none"
document.querySelector('#notloggedin').style.display = "none"
cabins()
showCabins()
orders()


function showCabins(){
    document.querySelector('#orders').style.display = "none"
    document.querySelector('#cabins').style.display = "block"
}

function showOrders(){
    document.querySelector('#cabins').style.display = "none"
    document.querySelector('#orders').style.display = "block"
}

function logOut(){
    localStorage.removeItem('jwt') // fungerar obviously int
    location.reload()
}