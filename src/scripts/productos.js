const renderProducto=document.getElementById("productos-grid")
const disponibles=document.getElementById("cantidad-productos")

const obtenerProductos=async()=>{
    try {
        const respuesta = await fetch("http://localhost:3000/productos"); 
        //await espera una respuesta tods los datos esta en respuesta
        if (!respuesta.ok) throw new Error("Error en la consulta");
        const datos = await respuesta.json(); //datps ontiene toda a info del servidor
        console.log("datos: ",datos)
        return datos;
        } catch (error) {
        console.error("Fallo GET:", error.message);
        
        }
};



const mostrarProductos=async()=>{
    const productos=await obtenerProductos()
    disponibles.textContent = `${productos.length} productos disponibles`
    let mostrar=""
    productos.forEach(producto => {
        mostrar+=`
        <div class="producto-card">
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-info">
                    <p class="producto-categoria">${producto.categoria}</p>
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-footer">
                    <div class="producto-precio">
                            <p class="precio-actual">$${producto.precioPorPeso}</p>
                            <p class="producto-unidad">/kg</p>
                    </div>
                    <button class="btn-agregar" data-id="${producto.id}">+ Agregar</button>

                </div>

            </div>

        </div>`
    });
    
    renderProducto.innerHTML=mostrar
}




mostrarProductos()