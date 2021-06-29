import ClientesService from "../services/clientes-service.js";

let lastItemClicked;

// #### Modals

const nuevoClienteModal = document.getElementById("nuevoClienteForm");
const modificarClienteModal = document.getElementById("modificarClienteForm");
const eliminarClienteModal = document.getElementById("eliminarClienteForm");
const eliminarClientesInactivosModal = document.getElementById("eliminarClientesInactivosForm");
const infoModal = document.getElementById("infoModal");

const overlayModals = document.getElementById("overlayModals");

function showModal(modal, show) {
    if (show) {
        overlayModals.classList.remove('hide-modal');
        modal.classList.remove('hide-modal');
    } else {
        nuevoClienteModal.classList.add('hide-modal');
        modificarClienteModal.classList.add('hide-modal');
        eliminarClienteModal.classList.add('hide-modal');
        eliminarClientesInactivosModal.classList.add('hide-modal');
        infoModal.classList.add('hide-modal');
        overlayModals.classList.add('hide-modal');
    }
}

// Listeners botones cerrar modal
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
document.getElementById("cancelarEliminarClientesInactivosFormButton").addEventListener("click", () => {
    showModal(eliminarClientesInactivosModal, false);
})

infoModal.addEventListener('submit', (e) => {
    e.preventDefault();
    showModal(infoModal, false);
})

function showInfoModal(text) {
    infoModal.getElementsByTagName("p")[0].innerHTML = text;
    showModal(null, false)
    showModal(infoModal, true);
}

// ##### Tabla clientesç
const tableClientesBody = document.getElementById("tableClientesBody");
function generateTablaClientes() {
    ClientesService.getClientes().then(clientes => {
        tableClientesBody.innerHTML = "";
        clientes.forEach(cliente => {
            const item = generateClientesTableItem(cliente)
            tableClientesBody.appendChild(item);
        })
    })
}
generateTablaClientes();

function generateClientesTableItem(cliente) {

    let activo = cliente.activo === "1";

    let item = document.createElement("tr");
    item.dataset.id = cliente.id;

    //language=HTML
    item.innerHTML = `
        <td>${cliente.id}</td>       
        <td>${cliente.nombre}</td>
        <td>${cliente.telefono ? cliente.telefono : "-"}</td>
        <td>${cliente.fecha_fin !== "0000-00-00"? cliente.fecha_fin : "Indefinido"}</td>
        <td class="opciones">
            <div>
                <!-- <button data-boton="usuarios"><i class="fa fa-fw fa-users"></i><span>Usuarios</span></button> -->
                <button type="button" data-boton="editar">
                    <i class="fa fa-fw fa-edit"></i><span class="btn-text">Editar</span>
                </button>
                <button type="button" data-boton="ver">
                    <i class="fa fa-fw fa-map"></i><span class="btn-text">Ver campos</span>
                </button>
                <button type="button" data-boton="eliminar" class="btn-red" ${activo ? "disabled" : ""}>
                    <i class="fa fa-fw fa-trash-alt"></i><span class="btn-text">Eliminar</span>
                </button>
            </div>            
        </td>        
        <td style="color: ${activo ? "limegreen" : "red"}">
                <!-- <i class="fa-fw ${activo ? "fa fa-circle" : "far fa-circle"}"></i> -->
            <label class="switch">
                <input type="checkbox" name="active" ${activo ? "checked" : ""}>
                <div class="slider round"></div>
            </label>
        </td>
    `

    /*item.querySelector("button[data-boton='usuarios']").onclick = () => {
        console.log("usuarios de " + item.dataset.id);
    }*/
    item.querySelector("button[data-boton='editar']").onclick = () => {
        showModal(modificarClienteModal, true);
        rellenarModificarClienteForm(item);
    }
    item.querySelector("button[data-boton='eliminar']").onclick = () => {
        lastItemClicked = item;
        showModal(eliminarClienteModal, true);
    }
    item.querySelector("button[data-boton='ver']").onclick = () => {
        window.sessionStorage.setItem("loggedAsUserID", cliente.id)
        window.location.href = "../usuario";
    }
    item.querySelector("input[name='active']").onclick = (e) => {
        let checked = e.target.checked;
        activarCliente(item, checked);
    }

    return item;

}

// ### Nuevo cliente
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

    ClientesService.crearCliente(formData).then(res => {
        if (res) {
            ClientesService.getCliente(res.id).then(cliente => {
                //createClienteListItem(cliente);
                const item = generateClientesTableItem(cliente)
                tableClientesBody.appendChild(item);
                nuevoClienteModal.reset();
                showInfoModal(`Se ha creado el cliente <b>${cliente.nombre}</b>`);
            })
        }
    });
}


// ### Modificar cliente
modificarClienteModal.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let displayId = document.querySelectorAll('#modificarClienteForm input[name="id"]')[0];
    modificarCliente(displayId.value, Object.fromEntries(formData)); //App
})

function modificarCliente(id, data) {

    let item = document.querySelectorAll('tr[data-id="' + id + '"]')[0];

    ClientesService.modificarCliente(id, data).then(res => {
        if (res) {

            ClientesService.getCliente(item.dataset.id).then(cliente => {
                let newItem = generateClientesTableItem(cliente);
                item.parentNode.replaceChild(newItem, item);
            });

            resetModificarClienteForm();
            //showModal(modificarClienteModal, false);
            showInfoModal(`El cliente <b>${id}</b> modificado correctamente.`);

        }
    });
}

function rellenarModificarClienteForm(item) {

    let displayId = document.querySelectorAll('#modificarClienteForm input[name="id"]')[0];
    let inputNombre = document.querySelectorAll('#modificarClienteForm input[name="nombre"]')[0];
    let inputTelefono = document.querySelectorAll('#modificarClienteForm input[name="telefono"]')[0];
    let inputFechaFin = document.querySelectorAll('#modificarClienteForm input[name="fecha_fin"]')[0];

    ClientesService.getCliente(item.dataset.id).then(cliente => {
        displayId.value = cliente.id;
        inputNombre.value = cliente.nombre;
        inputTelefono.value = cliente.telefono;
        inputFechaFin.value = cliente.fecha_fin;

        inputNombre.focus();
    })
}

function resetModificarClienteForm() {
    document.activeElement.blur();
    modificarClienteForm.reset();
}


// ## Eliminar clientes inactivos
let eliminarClientesInactivosButton = document.getElementById("eliminarClientesInactivosButton");
eliminarClientesInactivosButton.addEventListener('click', () => {
    showModal(eliminarClientesInactivosModal, true);
})

eliminarClientesInactivosModal.addEventListener('submit', (e) => {
    e.preventDefault();
    eliminarClientesInactivos();
    showInfoModal(`Se han eliminado todos los clientes inactivos.`);
})

function eliminarClientesInactivos() {
    ClientesService.eliminarCliente("inactivos").then(res => {
        if (res) {
            generateTablaClientes();
        }
    });
}

// ## Eliminar cliente
eliminarClienteModal.addEventListener('submit', (event) => {
    event.preventDefault();
    eliminarCliente(lastItemClicked);
    //showModal(eliminarClienteModal, false);
    showInfoModal(`El cliente ${lastItemClicked.dataset.id} se ha eliminado.`);
})

function eliminarCliente(item) {

    let id = item.dataset.id;

    ClientesService.eliminarCliente(id).then(res => {
        if (res) {
            item.remove();
        }
    });
}



// ## Alta/Baja cliente
function activarCliente(item, activar) {

    ClientesService.modificarCliente(item.dataset.id, {
        "activo": activar ? "1" : "0"
    }).then(res => {

        if (res) {

            ClientesService.getCliente(item.dataset.id).then(cliente => {
                let newItem = generateClientesTableItem(cliente);
                item.parentNode.replaceChild(newItem, item);
            });

            resetModificarClienteForm();
            showModal(modificarClienteModal, false);

        }
    });



}
