import ClientesService from "../services/clientes-service.js";


// Lista clientes
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

    item.innerHTML = cliente.id + " - " + cliente.nombre;
    item.dataset.id = cliente.id;

    // Buttons Container
    let buttonsContainer = document.createElement("div");

    // Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.onclick = () => {
        eliminarCliente(item);
    }
    let iconDelete = document.createElement("i");
    iconDelete.className = "fa fa-trash-alt fa-fw";
    deleteButton.appendChild(iconDelete);
    //deleteButton.innerHTML += "Eliminar";

    // Edit Button
    let editButton = document.createElement("button");
    editButton.onclick = () => {
        rellenarModificarClienteForm(item);
    }
    let iconEdit = document.createElement("i");
    iconEdit.className = "fa fa-edit fa-fw";
    editButton.appendChild(iconEdit);
    editButton.innerHTML += "Editar";


    //Add buttons to buttonsContainer
    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    //Add buttonsContainer to item
    item.appendChild(buttonsContainer);

    //Add item to list
    listaClientes.appendChild(item);

    return item;
}

// Nuevo cliente
let nuevoClienteForm = document.getElementById("nuevoClienteForm");
nuevoClienteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    nuevoCliente(formData); //App
})

function nuevoCliente(formData) {

    ClientesService.crearCliente(formData).then( res => {
        if(res) {
            console.log(res)
            ClientesService.getCliente(res.id).then(cliente => {
                createClienteListItem(cliente);
                nuevoClienteForm.reset();
            })
        }
    });
}

// Modificar cliente
let modificarClienteForm = document.getElementById("modificarClienteForm");
modificarClienteForm.addEventListener('submit', (event) => {
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

            console.log(res)

            listItem.childNodes[0].nodeValue = id + " - " + res.body.nombre;

            let ClienteModificado = {
                ...res.body
            }

            listItem.dataset.Cliente = JSON.stringify(ClienteModificado);

            listItem.classList.add("focused");

            resetModificarClienteForm();

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
        modificarClienteForm.classList.remove("disabled");
    })
}

let cancelarModificarClienteFormButton = document.getElementById("cancelarModificarClienteFormButton");
cancelarModificarClienteFormButton.onclick = () => {
    resetModificarClienteForm();
}

function resetModificarClienteForm(){
    document.activeElement.blur();
    modificarClienteForm.reset();
    modificarClienteForm.classList.add("disabled");
}


// Eliminar cliente

function eliminarCliente(item) {

    let id = item.dataset.id;
    ClientesService.eliminarCliente(id).then( res => {
        if(res) {
            item.remove();
        }
    });
}