let lastUserId = 0

const formu = document.getElementById('formu')
const name = document.getElementById('inp-name')
const surname = document.getElementById('inp-surname')
const year = document.getElementById('inp-year')

const addBTN = document.getElementById('btn-add')
const hiddenBTNS = document.getElementById('hidden-div')
const blockBTNS = document.getElementById('block-div')
const cleanBTN = document.getElementById('btn-clean')
const editBTN = document.getElementById('btn-edit')
const cancelBTN = document.getElementById('btn-cancel')

const divRows = document.getElementById('div-rows')

editBTN.addEventListener('click', e => {
    if(confirm('Esta seguro de guardar los cambios?')){
        const obj = {
        id: lastUserId,
        nombre: name.value,
        apellido: surname.value,
        edad: year.value,
        }
        putUser(obj)
        cleanFields()
        e.preventDefault()
        hiddenBTNS.style['display'] = 'none'
        blockBTNS.style['display'] = 'block'
        }
    else {
        name.focus()
        return
    }
})
cancelBTN.addEventListener('click', e => {
    hiddenBTNS.style['display'] = 'none'
    blockBTNS.style['display'] = 'block'
    cleanFields()
    name.focus()
})

cleanBTN.addEventListener('click', async(e) => {
    cleanFields()
    e.preventDefault()
})
addBTN.addEventListener('click', async (e) => {
    let id = await getId()
    const obj = {
        id: id[0].newId,
        nombre: name.value,
        apellido: surname.value,
        edad: year.value,
    }
    postUser(obj)
    cleanFields()
    e.preventDefault()
})

function cleanFields(){
    name.value = ''
    surname.value = ''
    year.value = ''
}
async function getId(){
    const respuesta = await fetch("http://localhost:3000/currentId")
    const gotId = await respuesta.json()
    incId(gotId[0].newId)
    return gotId
}
async function incId(id){
    const nextId = {
        id: 1,
        newId: id + 1
    }
    const res = await fetch('http://localhost:3000/currentId/1', {
        method: 'PUT',
        body: JSON.stringify(nextId),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json()
    return data
}

async function getUsers(){
    const respuesta = await fetch("http://localhost:3000/users")
    const data = await respuesta.json()
    return data
}

async function postUser(obj){
    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
}

async function putUser(obj){
    const response = await fetch(`http://localhost:3000/users/${obj.id}`, {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
}

async function clickRow(e){
    const id = this.dataset.id
    const response = await fetch(`http://localhost:3000/users/${id}`)
    const data = await response.json()
    name.value = data.nombre
    surname.value = data.apellido
    year.value = data.edad
    name.focus()
    hiddenBTNS.style['display'] = 'block'
    blockBTNS.style['display'] = 'none'
    lastUserId = id
}

function clickDelete(e){
    if(confirm('desea eliminar el usuario?')){}
}



document.addEventListener('DOMContentLoaded', async (e) => {
    divRows.innerHTML = ''
    
    let data = await getUsers()
    data.map(e => {
        let template = `
        <li class="row-line">
        <img src="./icons/remove.png" class="btn-delete">
        <a href="#" class="row" data-id="${e.id}">
        <p class="p-num">${e.id}</p>
        <p class="p-name">${e.nombre}</p>
        <p class="p-surname">${e.apellido}</p>
        </a>
        </li>
        `
        divRows.innerHTML += template
    })
    const rows = document.querySelectorAll('.row')
    rows.forEach(e => {
        e.onclick = clickRow
    })
    const deleteBTN = document.querySelectorAll('.btn-delete')
    deleteBTN.forEach(e => {
        e.onclick = clickDelete
    })
    e.preventDefault()
})