// PERSISTENCIA
function getCarrito() {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) return [];
    return JSON.parse(localStorage.getItem("carrito_" + session.email)) || [];
}

function saveCarrito(carrito) {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) {
        localStorage.setItem("carrito_" + session.email, JSON.stringify(carrito));
        actualizarInterfazCarrito();
    }
}

// ACCIONES
function agregarAlCarrito(id, nombre, precio) {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) {
        notificar("Debes iniciar sesión para comprar", true);
        return;
    }

    const idNum = parseInt(id);
    let carrito = getCarrito();
    const existe = carrito.find(i => i.id === idNum);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ id: idNum, nombre, precio: parseInt(precio), cantidad: 1 });
    }

    saveCarrito(carrito);
    notificar("Producto agregado al carrito");
}

function eliminarDelCarrito(id) {
    const idNum = parseInt(id);
    saveCarrito(getCarrito().filter(i => i.id !== idNum));
}

function modificarCantidad(id, accion) {
    const idNum = parseInt(id);
    let carrito = getCarrito();
    const item = carrito.find(i => i.id === idNum);

    if (item) {
        if (accion === "mas") item.cantidad++;
        if (accion === "menos" && item.cantidad > 1) item.cantidad--;
        saveCarrito(carrito);
    }
}

// INTERFAZ
function actualizarInterfazCarrito() {
    const carrito = getCarrito();
    const contador = document.getElementById("carrito-count");
    const items = document.getElementById("carrito-items");
    const total = document.getElementById("carrito-total");

    if (contador) contador.innerText = carrito.reduce((a, b) => a + b.cantidad, 0);
    if (!items || !total) return;

    let html = "";
    let suma = 0;

    carrito.forEach(i => {
        suma += i.precio * i.cantidad;
        html += `
        <div class="item-carrito">
            <h4>${i.nombre}</h4>
            <p>$${i.precio}</p>
            <div>
                <button class="btn-cambiar-cant" data-id="${i.id}" data-accion="menos">-</button>
                <span>${i.cantidad}</span>
                <button class="btn-cambiar-cant" data-id="${i.id}" data-accion="mas">+</button>
            </div>
            <button class="btn-eliminar-item" data-id="${i.id}">🗑️</button>
        </div>`;
    });

    items.innerHTML = html;
    total.innerText = `$${suma}`;

    document.querySelectorAll(".btn-cambiar-cant").forEach(b =>
        b.addEventListener("click", e => modificarCantidad(e.target.dataset.id, e.target.dataset.accion))
    );
    document.querySelectorAll(".btn-eliminar-item").forEach(b =>
        b.addEventListener("click", e => eliminarDelCarrito(e.target.dataset.id))
    );
}

// EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    actualizarInterfazCarrito();

    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const { id, nombre, precio } = e.target.dataset;
            if (id && nombre && precio) agregarAlCarrito(id, nombre, precio);
        });
    });

    document.getElementById("btn-comprar")?.addEventListener("click", () => {
        const carrito = getCarrito();
        if (carrito.length === 0) return notificar("Tu carrito está vacío", true);
        
        notificar("Compra realizada con éxito");
        saveCarrito([]);
        document.getElementById("carrito-modal").style.display = "none";
    });
});

const btnCarrito = document.querySelector(".btn-carrito");
const modalCarrito = document.getElementById("carrito-modal");
const btnCerrar = document.getElementById("btn-cerrar-carrito");

btnCarrito?.addEventListener("click", (e) => { e.preventDefault(); modalCarrito.style.display = "block"; });
btnCerrar?.addEventListener("click", () => { modalCarrito.style.display = "none"; });