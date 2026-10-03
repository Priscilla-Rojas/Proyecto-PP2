export const iniciarSesion = async (email, password) => {
    const usuarios = await obtenerUsuarios();
    console.log("en iniciar sesion")
    const usuario=noExisteMail(email,usuarios)
    if(usuario===true){
        console.log("no existe elk mail es true ")
        document.getElementById("error-email").style.display="block"
        return false
    }
    else if(contraseñaCorrecta(password,usuario)==false){
        console.log("contraseña incorrecta")
        document.getElementById("error-password").style.display="block"
        return false
    }
    else{
        console.log("devolvio id")
        document.getElementById("error-email").style.display="none"
        document.getElementById("error-password").style.display="none"
        console.log("existe")
        console.log(email)
        return usuario.id
    }
}


const obtenerUsuarios=async()=>{
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

const noExisteMail=(email,usuarios)=>{
    if(usuarios.filter(usuario=>usuario.mail===email).length===0){
        console.log("no existe mail va adevolver true")
        return true
    }else{
        let listaUsuarioActual=usuarios.filter(usuario=>usuario.mail===email)
        console.log("existe mail va adevolver id")
        return listaUsuarioActual[0]
    }}

const contraseñaCorrecta=(password,usuario)=>{
    if(usuario.contrasena===password){
        return true
    }else{
        console.log("contraseña incorrecta")
        return false            
}}