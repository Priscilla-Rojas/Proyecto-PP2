//PARTE GRAFICA
const btnIngresar = document.getElementById("btn-ingresar");
const btnIngresarPage = document.getElementById("btn-ingresar-page");
const btnIngresarMobile = document.getElementById("btn-ingresar-mobile");
const userModal = document.getElementById("modal-user");
var idUsuario

const modalUser = `<div class="modal-content">
          <section class="modal-header" id="modal-header">
            <div class="modal-header-buttons" id="modal-header-buttons">
                <div class="logo-container">
                    <a class="logo"><img src="../assets/logo.png" alt="Logo"> Tiziana</a>
                </div>
                <div class="close-modal" id="close-modal">
                    <button class="btn-close" id="btn-close"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg></button>
                </div>
            </div>
           
            <h3>Bienvenido de Vuelta</h3>
            <p>Ingresa a tu cuenta para poder comprar</p>
          </section>
          <section class="modal-body">
            <form class="modal-form" id="modal-form">
              <input class="input-ingresar" type="email" id="email" name="email" placeholder="Email" required>
              <p class="error-input" id="error-email">Email ingresado no existe</p>
              <input class="input-ingresar"type="password" id="password" name="password" placeholder="Contraseña" required>
              <p class="error-input" id="error-password">Contraseña incorrecta</p>
              <button class="ingresar-button" type="submit">Ingresar</button>
            </form>
          </section>
          <section class="modal-footer">
            <p>No tienes una cuenta? </p>
            <button class="btn-registro">Registrate</button>
          </section>
        </div>`
userModal.innerHTML = modalUser;
const btnCerrar = document.getElementById("btn-close");

btnIngresar.addEventListener("click", ()=> {
    console.log("Hice clic");
    userModal.classList.add("user-modal");
    console.log("supuestamente aparecio");
});

btnIngresarPage.addEventListener("click", ()=> {
    console.log("Hice clic");
    userModal.classList.add("user-modal");
    console.log("supuestamente aparecio");
});

btnIngresarMobile.addEventListener("click", ()=> {
    console.log("Hice clic");
    userModal.classList.add("user-modal");
    console.log("supuestamente aparecio");
});


btnCerrar.addEventListener("click", ()=> {
    console.log("cancelado");
    userModal.classList.remove("user-modal");
});


//INICIO DE SESION
import { iniciarSesion } from "./login.js";
const form = document.getElementById("modal-form");




form.addEventListener("submit", async(event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    idUsuario = await iniciarSesion(email, password);
    if (idUsuario!=false){
      sessionStorage.setItem("idUsuario", idUsuario);
      userModal.classList.remove("user-modal");
      document.dispatchEvent(new Event("inicioSesion"));
    }

});

export const usuarioActual = ()=>{
  return idUsuario
}