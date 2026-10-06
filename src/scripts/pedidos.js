const noRegistrado = document.getElementById("container-unregistered")
const registrado = document.getElementById("container-registered")

const listaPedidos=document.getElementById("orders-list")

const obtenerIdUsuario = () => {
    return Number(sessionStorage.getItem("idUsuario"));
}

const estaRegistrado=()=>{
  return sessionStorage.getItem("idUsuario") !== null;
}




const formatearFecha = (fecha) => {
    const fechaFormateada = new Date(fecha)

    return fechaFormateada.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })
}

const obtenerPedidos=async()=>{
    try {
        const respuesta = await fetch("http://localhost:3000/pedidos"); 
        //await espera una respuesta tods los datos esta en respuesta
        if (!respuesta.ok) throw new Error("Error en la consulta");
        const datos = await respuesta.json(); //datps ontiene toda a info del servidor
        console.log("datos: ",datos)
        return datos;
        } catch (error) {
        console.error("Fallo GET:", error.message);
        
        }
};

const obtenerDetallesPedidos=async() => {
    try {
        const respuesta = await fetch("http://localhost:3000/pedidoDetalle");

        if (!respuesta.ok) throw new Error("Error en la consulta");

        const datos = await respuesta.json();
        console.log("datos: ",datos)
        return datos;
    } catch (error) {
        console.error("Fallo GET:", error.message);
    }
};


const mostrarPedidos=async()=>{
    const idUsuarioActual = obtenerIdUsuario();
    const pedidos=await obtenerPedidos()
    const pedidosUsuario=pedidos.filter(pedido=>pedido.idUsuario===idUsuarioActual)
    const detalles=await obtenerDetallesPedidos()

    let mostrar=""
    const orderNumber=document.getElementById("order-number")
    orderNumber.textContent = `${pedidosUsuario.length} pedidos realizados`
    pedidosUsuario.forEach(pedido => {
        const detallesPedido = detalles.filter(detalle => detalle.idPedido === pedido.nroPedido)
        const cantidad= detallesPedido.length
        let precioTotal=0
        console.log("nuevo pedido")
        detallesPedido.forEach(detalle=>{
            console.log(detalle.precio)
            console.log(detalle.cantidad)
            precioTotal+=detalle.precio*detalle.cantidad
        })
        const estado=()=>{
            if (pedido.estado==="Preparando") return `<p class="preparando">Preparando</p>`
            if (pedido.estado==="En Camino") return `<p class="en-camino">En Camino</p>`
            if (pedido.estado==="Entregado") return `<p class="entregado">Entregado</p>`
        }
        mostrar+=`
        <li class="pedido">
            <section class="pedido-info">
                <div class="top-info">
                    <p>${pedido.nroPedido}</p>
                    ${estado()}
                </div>
                <div class="lower-info">
                    <p>${formatearFecha(pedido.fecha)}</p>
                    <p>${cantidad} productos</p>
                </div>
            </section>
            <section class="detalle-pedido">
                <p class="precio">$ ${precioTotal}</p>
                <a href="" class="detalle" data-id="${pedido.nroPedido}">
                            Ver detalle
                        </a>
            </section>

            
        </li>
    `
    });
    
    listaPedidos.innerHTML=mostrar
}

if (estaRegistrado()){
    noRegistrado.style.display = "none"
    registrado.style.display = "block"
    mostrarPedidos()
}else{
    noRegistrado.style.display = "block"
    registrado.style.display = "none"
}


document.addEventListener("inicioSesion", ()=>{
    noRegistrado.style.display = "none";
    registrado.style.display = "block";

    mostrarPedidos();
})
