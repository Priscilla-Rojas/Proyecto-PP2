const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const recetaId = params.get('id');

    if (!recetaId) {
        document.getElementById('detalle-container').innerHTML = '<div class="p-5 text-center"><h2>Receta no encontrada</h2><a href="recetas.html" class="btn btn-success mt-3">Volver a recetas</a></div>';
        return;
    }

    try {
        await loadHeaderFooter();
        await renderDetalle(recetaId);
    } catch (error) {
        console.error('Error cargando el detalle:', error);
        document.getElementById('detalle-container').innerHTML = '<div class="p-5 text-center"><h2>Ocurrió un error</h2><p>No se pudo cargar la receta.</p></div>';
    }
});

async function loadHeaderFooter() {
    const response = await fetch(`${API_URL}/tienda`);
    const data = await response.json();
    if (data && data.length > 0) {
        const tienda = data[0];
        const sloganEl = document.getElementById('footer-slogan');
        const emailEl = document.getElementById('footer-email');
        const phoneEl = document.getElementById('footer-phone');
        const addressEl = document.getElementById('footer-address');
        const deliveryEl = document.getElementById('footer-delivery');

        if (sloganEl) sloganEl.textContent = tienda.Slogan;
        if (emailEl) emailEl.innerHTML = tienda.Mail;
        if (phoneEl) phoneEl.innerHTML = tienda.Telefono;
        if (addressEl) addressEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16"><path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/><path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg> ${tienda.Direccion}`;
        if (deliveryEl) deliveryEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg> ${tienda['Horarios de Entrega']}`;
    }
}

async function renderDetalle(id) {
    const [recetaRes, ingredientesRes, productosRes, dificultadRes, categoriaRecetaRes, categoriasRes] = await Promise.all([
        fetch(`${API_URL}/recetas/${id}`),
        fetch(`${API_URL}/ingredienteReceta?idReceta=${id}`),
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/dificultad`),
        fetch(`${API_URL}/CategoriaReceta?idReceta=${id}`),
        fetch(`${API_URL}/categorias`)
    ]);

    if (!recetaRes.ok) {
        throw new Error("Receta no encontrada");
    }

    const receta = await recetaRes.json();
    const ingredientes = await ingredientesRes.json();
    const productos = await productosRes.json();
    const dificultades = await dificultadRes.json();
    const categoriaReceta = await categoriaRecetaRes.json();
    const categorias = await categoriasRes.json();

    const difObj = dificultades.find(d => d.id === receta.idDificultad);
    const difName = difObj ? difObj.nivel : 'Media';

    let catName = 'Receta';
    if (categoriaReceta.length > 0) {
        const catObj = categorias.find(c => c.id === categoriaReceta[0].idCategoria);
        if (catObj) catName = catObj.Descripcion;
    }

    let totalCost = 0;
    const ingredientsHTML = [];

    ingredientes.forEach(ing => {
        const prod = productos.find(p => p.id === ing.idProducto);
        if (prod) {
            let itemCost = 0;
            if (ing.unidad.toLowerCase() === 'gramos') {
                itemCost = (ing.cantidad / 1000) * prod.precioPorPeso;
            } else if (ing.unidad.toLowerCase() === 'kg') {
                itemCost = ing.cantidad * prod.precioPorPeso;
            } else if (ing.unidad.toLowerCase() === 'dientes') {
                 itemCost = (ing.cantidad / 10) * prod.precioPorPeso;
            } else {
                itemCost = ing.cantidad * prod.precioPorPeso;
            }
            
            totalCost += itemCost;

            ingredientsHTML.push(`
                <li class="ingredient-item">
                    <span class="ingredient-name">${prod.nombre}</span>
                    <span class="ingredient-qty">${ing.cantidad} ${ing.unidad}</span>
                </li>
            `);
        }
    });

    const assumedPortions = 4;
    const costPerPerson = totalCost / assumedPortions;

    const imgUrl = receta.imagen ? receta.imagen.replace('./src/assets/', '../assets/') : '../assets/recetas-img/apple.jpg';

    const stepsHTML = Object.entries(receta.Pasos).map(([stepNum, text]) => `
        <div class="paso-item">
            <span class="paso-number">Paso ${stepNum}</span>
            <p class="paso-text">${text}</p>
        </div>
    `).join('');

    let otrosIngredientesHTML = '';
    if (receta.otrosIngredientes && receta.otrosIngredientes.length > 0) {
        otrosIngredientesHTML = `
            <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <h3 class="detalle-section-title" style="font-size: 1.1rem; color: #4a5568;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                    </svg>
                    Otros ingredientes (No incluidos)
                </h3>
                <ul class="ingredients-list" style="opacity: 0.85;">
                    ${receta.otrosIngredientes.map(ing => `
                        <li class="ingredient-item" style="padding: 6px 0;">
                            <span class="ingredient-name" style="font-weight: 500;">${ing}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    const html = `
        <div class="detalle-header">
            <img src="../${receta.imagen}" alt="${receta.title}" class="detalle-img">
            <div class="detalle-overlay">
                <div class="detalle-badges">
                    <span class="badge-cat">${catName}</span>
                    <span class="badge-diff">${difName}</span>
                    <span class="badge-comensales" style="background: rgba(255,255,255,0.25); backdrop-filter: blur(5px); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; margin-left: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16" style="margin-right: 4px; vertical-align: text-bottom;">
                          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                        </svg>
                        Para ${receta.comensales || 4} personas
                    </span>
                </div>
                <h1 class="detalle-title">${receta.title}</h1>
            </div>
        </div>

        <div class="detalle-body">
            <div class="detalle-main-content">
                <h2 class="detalle-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M5 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5 7a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 5 7zm0 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
                      <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32-.202 0-.368.145-.364.339v.041zM2.564 5h-.635V2.924h-.057L1.13 3.663v-.532l1.378-1.127h.056V5z"/>
                    </svg>
                    Preparación
                </h2>
                <div class="pasos-list">
                    ${stepsHTML}
                </div>
            </div>

            <div class="detalle-sidebar">
                <div class="ingredients-panel">
                    <div class="cost-box">
                        <div class="cost-label">Costo de Receta</div>
                        <div class="cost-value">$${Math.round(totalCost)}</div>
                        <div class="cost-per-person">
                            <strong>$${Math.round(costPerPerson)}</strong> por persona
                        </div>
                        <small style="color: #a0aec0; display: block; margin-top: 5px;">* Rinde ${assumedPortions} porciones</small>
                    </div>

                    <h3 class="detalle-section-title" style="font-size: 1.25rem;">Ingredientes</h3>
                    <ul class="ingredients-list">
                        ${ingredientsHTML.join('')}
                    </ul>

                    ${otrosIngredientesHTML}

                    <button class="btn-buy-all" onclick="alert('Se han añadido los ingredientes al carrito!')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                          <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                        Comprar Ingredientes
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detalle-container').innerHTML = html;
}
