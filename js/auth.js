// Función robusta de notificaciones
function notificar(texto, esError = false) {
    let contenedor = document.getElementById("notificacion-global");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "notificacion-global";
        document.body.appendChild(contenedor);
    }
    let mensaje = document.getElementById("notificacion-texto");
    if (!mensaje) {
        mensaje = document.createElement("p");
        mensaje.id = "notificacion-texto";
        contenedor.appendChild(mensaje);
    }

    mensaje.textContent = texto;
    contenedor.className = "notificacion-visible";
    contenedor.style.color = esError ? "#a85d32" : "#5a7a72";

    setTimeout(() => {
        contenedor.className = "notificacion-hidden";
    }, 3000);
}


// FUNCIONES DE USUARIO

function getUsers() { return JSON.parse(localStorage.getItem("users")) || []; }
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }
function getSession() { return JSON.parse(localStorage.getItem("session")); }

// Lógica de registro
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById("nombre").value.trim();
        const fecha = document.getElementById("fechaNacimiento").value;
        const ciudad = document.getElementById("ciudad").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validaciones
        if (!nombre || !fecha || !ciudad || !email || !password) {
            return notificar("Completa todos los campos", true);
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return notificar("El email no tiene un formato válido", true);
        }

        if (password.length <= 4) {
            return notificar("La contraseña debe tener más de 4 caracteres", true);
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return notificar("Ese email ya está registrado", true);
        }

        // Guardar
        users.push({ nombre, fecha, ciudad, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        
        notificar("Usuario registrado correctamente");
        formRegistro.reset();
        setTimeout(() => { window.location.href = "../index.html"; }, 2000);
    });
}

// ======================
// LOGIN
// ======================
const formLoginHeader = document.getElementById("formLoginHeader");
if (formLoginHeader) {
    formLoginHeader.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            notificar("Email o contraseña incorrectos", true);
            return;
        }

        localStorage.setItem("session", JSON.stringify(user));
        notificar(`Bienvenido ${user.nombre}`);
        
        actualizarInterfazHeader();
        actualizarInterfazCarrito();
        setTimeout(() => {
            actualizarInterfazHeader();
        }, 500);
    });
}

// ======================
// HEADER
// ======================
function actualizarInterfazHeader() {
    const authContainer = document.getElementById("auth-container");
    if (!authContainer) return;
    const session = getSession();

    if (session) {
        authContainer.innerHTML = `
            <div style="display:flex;align-items:center;gap:15px;color:white;font-family:'Cinzel',serif;font-size:0.9rem;">
                <span>Hola, <strong>${session.nombre}</strong></span>
                <button id="btn-logout" class="btn-crear">Salir</button>
            </div>
        `;
        document.getElementById("btn-logout").addEventListener("click", () => {
            localStorage.removeItem("session");
            actualizarInterfazHeader();
            actualizarInterfazCarrito();
            window.location.reload();
        });
    }
}

document.addEventListener("DOMContentLoaded", actualizarInterfazHeader);