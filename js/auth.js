// USUARIOS
function getUsers() { return JSON.parse(localStorage.getItem("users")) || []; }
function getSession() { return JSON.parse(localStorage.getItem("session")); }

// REGISTRO
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const fecha = document.getElementById("fechaNacimiento").value;
        const ciudad = document.getElementById("ciudad").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!nombre || !fecha || !ciudad || !email || !password) return notificar("Completa todo", true);
        if (password.length < 5) return notificar("Contraseña corta", true);

        const users = getUsers();
        if (users.find(u => u.email === email)) return notificar("Email ya registrado", true);

        users.push({ nombre, fecha, ciudad, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        notificar("Registrado correctamente");
        setTimeout(() => { window.location.href = "../index.html"; }, 2000);
    });
}

// LOGIN
const formLoginHeader = document.getElementById("formLoginHeader");
if (formLoginHeader) {
    formLoginHeader.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) return notificar("Datos incorrectos", true);
        localStorage.setItem("session", JSON.stringify(user));
        actualizarInterfazHeader();
    });
}

// HEADER
function actualizarInterfazHeader() {
    const authContainer = document.getElementById("auth-container");
    if (!authContainer) return;
    const session = getSession();

    if (session) {
        authContainer.innerHTML = `<div class="header-user">Hola, <strong>${session.nombre}</strong> <button id="btn-logout">Salir</button></div>`;
        document.getElementById("btn-logout").addEventListener("click", () => {
            localStorage.removeItem("session");
            window.location.reload();
        });
    }
}

document.addEventListener("DOMContentLoaded", actualizarInterfazHeader);