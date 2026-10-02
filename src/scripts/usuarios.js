const btnIngresar = document.getElementById("btn-ingresar");
const userModal = document.getElementById("modal-user");
const modalUser = ``
btnIngresar.addEventListener("click", ()=> {
    console.log("Hice clic");
    userModal.classList.add("user-modal");
    console.log("supuestamente aparecio");
});