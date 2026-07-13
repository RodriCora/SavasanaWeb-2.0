// NOTIFICACIONES
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
    setTimeout(() => { contenedor.className = "notificacion-hidden"; }, 3000);
}
