import UsuariosService from "../services/usuarios-service.js";
import ClientesService from "../services/clientes-service.js";

let GestionUsuarios = {
    abrirPanel: abrirPanelGestionUsuarios,
}
export default GestionUsuarios;

let clienteId;

// Panel
let panelGestionUsuarios = document.getElementById("gestionUsuarios");
function abrirPanelGestionUsuarios(itemCliente) {


    panelGestionUsuarios.classList.add("show");

    clienteId = itemCliente.dataset.id

    document.getElementById("nombreClienteDisplay").innerText = itemCliente.dataset.nombre;
    generateTablaUsuarios(clienteId);

}

const btnCerrarPanelGestionUsuarios = document.getElementById('btn-cerrar-gestionUsuarios');
btnCerrarPanelGestionUsuarios.addEventListener('click', function (e) {
    e.preventDefault();
    panelGestionUsuarios.classList.remove("show");
});

let lastItemClicked;

// #### Modals

const nuevoUsuarioModal = document.getElementById("nuevoUsuarioForm");
const modificarUsuarioModal = document.getElementById("modificarUsuarioForm");
const eliminarUsuarioModal = document.getElementById("eliminarUsuarioForm");
const infoModal = document.getElementById("infoModal");

const overlayModals = document.getElementById("overlayModals");

function showModal(modal, show) {
    if (show) {
        overlayModals.classList.remove('hide-modal');
        modal.classList.remove('hide-modal');
    } else {
        nuevoUsuarioModal.classList.add('hide-modal');
        modificarUsuarioModal.classList.add('hide-modal');
        eliminarUsuarioModal.classList.add('hide-modal');
        infoModal.classList.add('hide-modal');
        overlayModals.classList.add('hide-modal');
    }
}

// Listeners botones cerrar modal
document.getElementById("cancelarNuevoUsuarioFormButton").addEventListener("click", (e) => {
    showModal(nuevoUsuarioModal, false);
})
document.getElementById("cancelarModificarUsuarioFormButton").addEventListener("click", () => {
    resetModificarUsuarioForm();
    showModal(modificarUsuarioModal, false);
})
document.getElementById("cancelarEliminarUsuarioFormButton").addEventListener("click", () => {
    showModal(eliminarUsuarioModal, false);
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


// ##### Tabla usuarios
const tableUsuariosBody = document.getElementById("tableUsuariosBody");
function generateTablaUsuarios(clienteId) {
    tableUsuariosBody.innerHTML = "";
    ClientesService.getUsuariosCliente(clienteId).then(usuarios => {
        usuarios.forEach(usuario => {
            const item = generateUsuarioTableItem(usuario)
            tableUsuariosBody.appendChild(item);
        })
    }).catch(err => {
        //
    })
}

function generateUsuarioTableItem(usuario) {

    let bloqueado = usuario.bloqueado === "1";

    let item = document.createElement("tr");
    item.dataset.id = usuario.id;

    //language=HTML
    item.innerHTML = `
        <td class="small">${usuario.id}</td>       
        <td>${usuario.nombre}</td>
        <td>${usuario.email ? usuario.email : "-"}</td>
        <td class="opciones">
            <div>
                <button type="button" data-boton="editar">
                    <i class="fa fa-fw fa-edit"></i><span class="btn-text">Editar</span>
                </button>
                <button type="button" data-boton="ver" ${bloqueado ? "disabled" : ""}>
                    <i class="fa fa-fw fa-map"></i><span class="btn-text">Ver campos</span>
                </button>
                <button type="button" data-boton="eliminar" class="btn-red" ${!bloqueado ? "disabled" : ""}>
                    <i class="fa fa-fw fa-trash-alt"></i><span class="btn-text">Eliminar</span>
                </button>
            </div>            
        </td>        
        <td class="small">
            <label class="switch switch-red">
                <input type="checkbox" name="active" ${bloqueado ? "checked" : ""}>
                <div class="slider round"></div>
            </label>
        </td>
    `

    item.querySelector("button[data-boton='editar']").onclick = () => {
        showModal(modificarUsuarioModal, true);
        rellenarModificarUsuarioForm(item);
    }
    item.querySelector("button[data-boton='eliminar']").onclick = () => {
        lastItemClicked = item;
        showModal(eliminarUsuarioModal, true);
    }
    item.querySelector("button[data-boton='ver']").onclick = () => {
        window.sessionStorage.setItem("loggedAsUserID", usuario.id)
        window.location.href = "../usuario";
    }
    item.querySelector("input[name='active']").onclick = (e) => {
        let checked = e.target.checked;
        bloquearUsuario(item, checked);
    }

    return item;

}


// ### Nuevo usuario
let nuevoUsuarioButton = document.getElementById("nuevoUsuarioButton");
nuevoUsuarioButton.addEventListener('click', () => {
    showModal(nuevoUsuarioModal, true);
})

nuevoUsuarioModal.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    nuevoUsuario(formData); //App
})

function nuevoUsuario(formData) {

    formData.append("id_cliente", clienteId);
    UsuariosService.crearUsuario(formData).then(res => {
        console.log(res);
        if (res) {
            UsuariosService.getUsuario(res.id).then(usuario => {
                const item = generateUsuarioTableItem(usuario)
                tableUsuariosBody.appendChild(item);
                nuevoUsuarioModal.reset();
                showInfoModal(`Se ha creado el usuario <b>${usuario.nombre}</b>`);
            })
        }
    });
}


// ### Modificar usuario
modificarUsuarioModal.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(event.target);
    let displayId = document.querySelectorAll('#modificarUsuarioForm input[name="id"]')[0];
    modificarUsuario(displayId.value, Object.fromEntries(formData)); //App
})

function modificarUsuario(id, data) {

    let item = document.querySelectorAll('tr[data-id="' + id + '"]')[0];

    UsuariosService.modificarUsuario(id, data).then(res => {
        if (res) {

            UsuariosService.getUsuario(item.dataset.id).then(usuario => {
                let newItem = generateUsuarioTableItem(usuario);
                item.parentNode.replaceChild(newItem, item);
            });

            resetModificarUsuarioForm();
            showModal(modificarUsuarioModal, false);
            showInfoModal(`El usuario <b>${id}</b> modificado correctamente.`);

        }
    });
}

function rellenarModificarUsuarioForm(item) {

    let displayId = document.querySelectorAll('#modificarUsuarioForm input[name="id"]')[0];
    let inputNombre = document.querySelectorAll('#modificarUsuarioForm input[name="nombre"]')[0];
    let inputEmail = document.querySelectorAll('#modificarUsuarioForm input[name="email"]')[0];

    UsuariosService.getUsuario(item.dataset.id).then(usuario => {
        displayId.value = usuario.id;
        inputNombre.value = usuario.nombre;
        inputEmail.value = usuario.email;

        inputNombre.focus();
    })
}

function resetModificarUsuarioForm() {
    document.activeElement.blur();
    modificarUsuarioModal.reset();
}

// ## Eliminar usuario
eliminarUsuarioModal.addEventListener('submit', (event) => {
    event.preventDefault();
    eliminarUsuario(lastItemClicked);
    showModal(eliminarUsuarioModal, false);
    showInfoModal(`El usuario ${lastItemClicked.dataset.id} se ha eliminado.`);
})

function eliminarUsuario(item) {

    let id = item.dataset.id;

    UsuariosService.eliminarUsuario(id).then(res => {
        if (res) {
            item.remove();
        }
    });
}



// ## Alta/Baja usuario
function bloquearUsuario(item, bloquear) {

    UsuariosService.modificarUsuario(item.dataset.id, {
        "bloqueado": bloquear ? "1" : "0"
    }).then(res => {

        if (res) {

            UsuariosService.getUsuario(item.dataset.id).then(usuario => {
                let newItem = generateUsuarioTableItem(usuario);
                item.parentNode.replaceChild(newItem, item);
            });

        }
    });
}


