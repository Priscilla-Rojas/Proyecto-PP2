const API_URL = 'http://127.0.0.1:3000';

let allRecetas = [];
let categoriasMap = {}; // idCategoria -> Descripcion
let dificultadMap = {}; // id -> nivel
let recetaCatMap = {}; // idReceta -> idCategoria

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTiendaInfo();
        await loadData();
        renderFilters();
        renderRecetas('0'); // '0' means Todas
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

async function loadTiendaInfo() {
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

async function loadData() {
    const [recetasRes, categoriasRes, catRecetaRes, dificultadRes] = await Promise.all([
        fetch(`${API_URL}/recetas`),
        fetch(`${API_URL}/categorias?Tipo=Recetas`),
        fetch(`${API_URL}/CategoriaReceta`),
        fetch(`${API_URL}/dificultad`)
    ]);

    allRecetas = await recetasRes.json();
    const categorias = await categoriasRes.json();
    const catReceta = await catRecetaRes.json();
    const dificultad = await dificultadRes.json();

    categorias.forEach(c => {
        categoriasMap[c.id] = c.Descripcion;
    });

    catReceta.forEach(cr => {
        recetaCatMap[cr.idReceta] = cr.idCategoria;
    });

    dificultad.forEach(d => {
        dificultadMap[d.id] = d.nivel;
    });
}

function renderFilters() {
    const filtersList = document.getElementById('filters-list');
    
    // Add dynamic categories to filter list
    for (const id in categoriasMap) {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.id = id;
        btn.textContent = mapCategoryName(categoriasMap[id]);
        filtersList.appendChild(btn);
    }

    const buttons = filtersList.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderRecetas(e.target.dataset.id);
            e.target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
    });

    setupScrollArrows();
}

function setupScrollArrows() {
    const list = document.getElementById('filters-list');
    const leftArrow = document.getElementById('scroll-left');
    const rightArrow = document.getElementById('scroll-right');

    if (!list || !leftArrow || !rightArrow) return;

    function updateArrows() {
        if (list.scrollLeft <= 0) {
            leftArrow.classList.add('hidden');
        } else {
            leftArrow.classList.remove('hidden');
        }

        if (Math.ceil(list.scrollLeft + list.clientWidth) >= list.scrollWidth) {
            rightArrow.classList.add('hidden');
        } else {
            rightArrow.classList.remove('hidden');
        }
    }

    list.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);

    leftArrow.addEventListener('click', () => {
        list.scrollBy({ left: -150, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
        list.scrollBy({ left: 150, behavior: 'smooth' });
    });

    // Check after rendering
    setTimeout(updateArrows, 100);
}

// Convert "Platos Principales" to "Principal" for UI
function mapCategoryName(name) {
    if (name === "Platos Principales") return "Principales";
    if (name === "Entradas") return "Entradas";
    if (name === "Sopas") return "Sopas";
    if (name === "Postres") return "Postres";
    if (name === "Ensaladas") return "Ensaladas";
    if (name === "Bebidas") return "Bebidas";
    return name;
}

function renderRecetas(categoryId) {
    const grid = document.getElementById('recetas-grid');
    grid.innerHTML = '';

    const filtered = categoryId === '0' 
        ? allRecetas 
        : allRecetas.filter(r => recetaCatMap[r.id] == categoryId);

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #777;">No hay recetas en esta categoría.</p>';
        return;
    }

    const html = filtered.map(recipe => {
        const catId = recetaCatMap[recipe.id];
        const catName = categoriasMap[catId] ? mapCategoryName(categoriasMap[catId]) : 'Receta';
        const diffName = dificultadMap[recipe.idDificultad] || 'Media';
        
        // Use placeholder values based on ID for visual consistency
        const time = 15 + (recipe.id % 5) * 10;
        const portions = 2 + (recipe.id % 3) * 2;
        const kcal = 150 + (recipe.id % 10) * 40;

        const description = Object.values(recipe.Pasos).join(' ');
        const shortDescription = description.length > 80 ? description.substring(0, 77) + '...' : description;

        const imgUrl = recipe.imagen ? recipe.imagen.replace('./src/', '/src/') : '/src/assets/recetas-img/apple.jpg';

        return `
        <article class="receta-card">
            <div class="receta-card__img-container">
                <img src="${imgUrl}" alt="${recipe.title}" class="receta-card__img" onerror="this.src='/src/assets/recetas-img/apple.jpg'">
                <div class="receta-card__badges">
                    <span class="badge-cat">${catName}</span>
                    <span class="badge-diff">${diffName}</span>
                </div>
                <div class="receta-card__fav">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                      <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 8 1.146c4.721-4.186 15.333 3.722 8 13.854z"/>
                    </svg>
                </div>
            </div>
            <div class="receta-card__content">
                <h3 class="receta-card__title">${recipe.title}</h3>
                <p class="receta-card__desc">${shortDescription}</p>
                <div class="receta-card__meta">
                    <span class="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                        </svg>
                        ${time} min
                    </span>
                    <span class="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                        </svg>
                        ${portions} porc.
                    </span>
                    <span class="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-fire" viewBox="0 0 16 16">
                          <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"/>
                        </svg>
                        ${kcal} kcal
                    </span>
                </div>
                <button class="receta-card__btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    Preparar compra
                </button>
            </div>
        </article>
        `;
    }).join('');

    grid.innerHTML = html;
}
