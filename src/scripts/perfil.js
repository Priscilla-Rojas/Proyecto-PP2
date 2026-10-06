/*const obtenerIdUsuario = () => {
    return Number(sessionStorage.getItem("idUsuario"));
}*/

const obtenerIdUsuario = 1

const nombre = document.getElementById("nombre-usuario")
const correo = document.getElementById("correo-usuario")
const nombreCompleto=document.getElementById("nombre-completo")
const email=document.getElementById("correo-electronico")
const direccion=document.getElementById("direccion")
const telefono=document.getElementById("telefono")



const obtenerUsuarios = async()=>{
    try {
        const respuesta = await fetch("http://localhost:3000/usuarios"); 
        //await espera una respuesta tods los datos esta en respuesta
        if (!respuesta.ok) throw new Error("Error en la consulta");
        const datos = await respuesta.json(); //datps ontiene toda a info del servidor
        console.log("datos: ",datos)
        return datos;
        } catch (error) {
        console.error("Fallo GET:", error.message);
        
        }
};

const mostrarDatos=async()=>{
    const idUsuarioActual = obtenerIdUsuario;
    const usuarios=await obtenerUsuarios()
    const usuario=usuarios.find(usuario=>usuario.id==idUsuarioActual)
    nombre.textContent=usuario.nombre
    correo.textContent=usuario.mail
    nombreCompleto.textContent=usuario.nombre+" "+usuario.apellido
    email.textContent=usuario.mail
    direccion.textContent=usuario.direccion
    telefono.textContent=usuario.telefono

    
}

mostrarDatos()

