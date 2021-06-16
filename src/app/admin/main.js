import ClientesService from "../services/clientes-service.js";

let lastItemClicked;

// #### Modals

const nuevoClienteModal = document.getElementById("nuevoClienteForm");
const modificarClienteModal = document.getElementById("modificarClienteForm");
const eliminarClienteModal = document.getElementById("eliminarClienteForm");

const overlayModals = document.getElementById("overlayModals");

function showModal(modal, show){
    if(show) {
        overlayModals.classList.remove('hide-modal');
        modal.classList.remove('hide-modal');
    } else {
        nuevoClienteModal.classList.add('hide-modal');
        modificarClienteModal.classList.add('hide-modal');
        overlayModals.classList.add('hide-modal');
        modal.classList.add('hide-modal');
    }
}

document.getElementById("cancelarNuevoClienteFormButton").addEventListener("click", (e) => {
    showModal(nuevoClienteModal, false);
})
document.getElementById("cancelarModificarClienteFormButton").addEventListener("click", () => {
    resetModificarClienteForm();
    showModal(modificarClienteModal, false);
})
document.getElementById("cancelarEliminarClienteFormButton").addEventListener("click", () => {
    showModal(eliminarClienteModal, false);
})


// ##### Lista clientes
const listaClientes = document.getElementById("listaClientes");
ClientesService.getClientes().then(clientes => {
    clientes.forEach(cliente => {
        createClienteListItem(cliente);
    })
})

function createClienteListItem(cliente){

    let item = document.createElement("li");
    item.classList.add("cliente-item");

    //

    item.innerHTML = `<div class="cliente-info"><span class="cliente-id">${cliente.id}</span>${cliente.nombre}</div>`;
    item.dataset.id = cliente.id;

    // Buttons Container
    let buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("cliente-buttons")

    // Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.onclick = () => {
        showModal(eliminarClienteModal, true);
        lastItemClicked = item;
    }
    //deleteButton.classList.add("btn-red");
    let iconDelete = document.createElement("i");
    //iconDelete.className = "fa fa-trash-alt fa-fw";
    iconDelete.className = "fa fa-user-slash fa-fw";
    deleteButton.appendChild(iconDelete);
    //deleteButton.innerHTML += "Eliminar";

    // Edit Button
    let editButton = document.createElement("button");
    editButton.onclick = () => {
        showModal(modificarClienteModal, true);
        rellenarModificarClienteForm(item);
    }
    let iconEdit = document.createElement("i");
    iconEdit.className = "fa fa-edit fa-fw";
    editButton.appendChild(iconEdit);
    editButton.innerHTML += "Editar";

    // Usuarios Button
    let usersButton = document.createElement("button");
    usersButton.classList.add("users-button")
    usersButton.onclick = () => {
        //TODO: Cambiar a la pantalla de usuarios del cliente seleccionado
    }
    let iconUsers = document.createElement("i");
    iconUsers.className = "fa fa-users fa-fw";
    usersButton.appendChild(iconUsers);
    usersButton.innerHTML += "Gestionar usuarios";

    // Campos Button
    let camposButton = document.createElement("button");
    camposButton.classList.add("campos-button")
    camposButton.onclick = () => {
        //TODO: Cambiar a la pantalla de campos del cliente seleccionado
    }
    let iconCampos = document.createElement("i");
    iconCampos.className = "fab fa-pagelines fa-fw";
    camposButton.appendChild(iconCampos);
    camposButton.innerHTML += "Gestionar campos";


    //Add buttons to buttonsContainer
    buttonsContainer.appendChild(usersButton);
    buttonsContainer.appendChild(camposButton);
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    //Add buttonsContainer to item
    item.appendChild(buttonsContainer);

    //Add item to list
    listaClientes.appendChild(item);

    return item;
}

// ##### Nuevo cliente

let nuevoClienteButton = document.getElementById("nuevoClienteButton");
nuevoClienteButton.addEventListener('click', () => {
    showModal(nuevoClienteModal, true);
})

nuevoClienteModal.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    nuevoCliente(formData); //App
})

function nuevoCliente(formData) {

    ClientesService.crearCliente(formData).then( res => {
        if(res) {
            ClientesService.getCliente(res.id).then(cliente => {
                createClienteListItem(cliente);
                nuevoClienteForm.reset();
                showModal(nuevoClienteModal, false);
            })
        }
    });
}


// ##### Modificar cliente
modificarClienteModal.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let displayId = document.querySelectorAll('#modificarClienteForm input[name="id"]')[0];
    modificarCliente(displayId.value, formData); //App
})
function modificarCliente(id, formData) {

    let listItem = document.querySelectorAll('#listaClientes li[data-id="'+ id + '"]')[0];

    listItem.classList.remove("focused");
    
    ClientesService.modificarCliente(id, formData).then( res => {
        if(res) {

            listItem.childNodes[0].nodeValue = id + " - " + res.body.nombre;

            let ClienteModificado = {
                ...res.body
            }

            listItem.dataset.Cliente = JSON.stringify(ClienteModificado);

            listItem.classList.add("focused");

            resetModificarClienteForm();
            showModal(modificarClienteModal, false);

        }
    });
}

function rellenarModificarClienteForm(item) {

    let displayId = document.querySelectorAll('#modificarClienteForm input[name="id"]')[0];
    let inputNombre = document.querySelectorAll('#modificarClienteForm input[name="nombre"]')[0];

    ClientesService.getCliente(item.dataset.id).then( cliente => {
        displayId.value = cliente.id;
        inputNombre.value = cliente.nombre;

        inputNombre.focus();
    })
}


function resetModificarClienteForm(){
    document.activeElement.blur();
    modificarClienteForm.reset();
}

// #### Eliminar cliente

eliminarClienteModal.addEventListener('submit', (event) => {
    event.preventDefault();
    eliminarCliente(lastItemClicked);
    showModal(eliminarClienteModal, false);
})

function eliminarCliente(item) {

    let id = item.dataset.id;
    ClientesService.eliminarCliente(id).then( res => {
        if(res) {
            item.remove();
        }
    });
}