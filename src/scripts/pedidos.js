const noRegistrado = document.getElementById("container-unregistered")
const registrado = document.getElementById("container-registered")
const estaRegistrado=true
const listaPedidos=document.getElementById("orders-list")

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
    const pedidos=await obtenerPedidos()
    const detalles=await obtenerDetallesPedidos()

    let mostrar=""
    const orderNumber=document.getElementById("order-number")
    orderNumber.textContent = `${pedidos.length} pedidos realizados`
    pedidos.forEach(pedido => {
        const detallesPedido = detalles.filter(detalle => detalle.idPedido === pedido.nroPedido)
        const cantidad= detallesPedido.length
        let precioTotal=""
        console.log("nuevo pedido")
        detallesPedido.forEach(detalle=>{
            console.log(detalle.precio)
            console.log(detalle.cantidad)
            precioTotal+=detalle.precio*detalle.cantidad
        })
        mostrar+=`
        <li class="pedido">
            <section class="pedido-info">
                <div class="top-info">
                    <p>${pedido.nroPedido}</p>
                    <p class="estado">${pedido.estado}</p>
                </div>
                <div class="lower-info">
                    <p>${pedido.fecha}</p>
                    <p>${cantidad} productos</p>
                </div>
            </section>
            <section class="detalle-pedido">
                <p>${precioTotal}</p>
                <a href="" class="detalle" data-id="${pedido.nroPedido}">
                            Ver detalle
                        </a>
            </section>

            
        </li>
    `
    });
    
    listaPedidos.innerHTML=mostrar
}



if (estaRegistrado){
    noRegistrado.style.display = "none"
    registrado.style.display = "block"
    mostrarPedidos()
}else{
    noRegistrado.style.display = "block"
    registrado.style.display = "none"
}

