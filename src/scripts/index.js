const API_URL = 'http://127.0.0.1:3000';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTiendaInfo();
        await loadFeaturedProducts();
        await loadDailyOffers();
        await loadPopularRecipes();
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
        if (addressEl) addressEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg> ${tienda.Direccion}`;
        if (deliveryEl) deliveryEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
          <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
          </svg> ${tienda['Horarios de Entrega']}`;
    }
}

async function loadFeaturedProducts() {
    const response = await fetch(`${API_URL}/productos?_limit=4`);
    const products = await response.json();
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <article class="product-card">
          <div class="product-card__image-container">
            <img src="${product.imagen || './src/assets/recetas-img/apple.jpg'}" alt="${product.nombre}" class="product-card__image" onerror="this.src='./src/assets/recetas-img/apple.jpg'">
            <span class="product-card__badge product-card__badge--green">Destacado</span>
          </div>
          <div class="product-card__content">
            <span class="product-card__category">${product.categoria.toUpperCase()}</span>
            <h3 class="product-card__name">${product.nombre}</h3>
            <p class="product-card__description">${product.descripcion}</p>
            <div class="product-card__footer">
              <span class="product-card__price">$${product.precioPorPeso} <br/> <small class="product-card__price--unit">/kg</small></span>
              <button class="product-card__button">+ Agregar</button>
            </div>
          </div>
        </article>
    `).join('');
}

async function loadDailyOffers() {
    const offersResponse = await fetch(`${API_URL}/Oferta?Estado=Activa&_limit=3`);
    const offers = await offersResponse.json();
    
    const productsResponse = await fetch(`${API_URL}/productos`);
    const products = await productsResponse.json();

    const container = document.getElementById('daily-offers-container');
    if (!container) return;

    container.innerHTML = offers.map(offer => {
        const product = products.find(p => p.id === offer.IdProducto);
        if (!product) return '';
        const discountedPrice = product.precioPorPeso * (1 - offer.Porcentaje / 100);
        
        return `
        <article class="offer-card">
          <img src="${product.imagen || './src/assets/recetas-img/apple.jpg'}" alt="${product.nombre}" class="offer-card__image" onerror="this.src='./src/assets/recetas-img/apple.jpg'">
          <div class="offer-card__info">
            <span class="offer-card__tag">-${offer.Porcentaje}% HOY</span>
            <h3 class="offer-card__name">${product.nombre}</h3>
            <p class="offer-card__price">
              <strong>$${discountedPrice.toFixed(0)}</strong> <del>$${product.precioPorPeso}</del> <span class="offer-card__price-unit">/kg</span>
            </p>
            <button class="offer-card__button">
              <span class="offer-card__button-plus">+</span>
              <span class="offer-card__button-text">Agregar al carrito</span>
            </button>
          </div>
        </article>
        `;
    }).join('');
}

async function loadPopularRecipes() {
    const response = await fetch(`${API_URL}/recetas?_limit=6`);
    const recipes = await response.json();
    
    const diffResponse = await fetch(`${API_URL}/dificultad`);
    const dificultades = await diffResponse.json();

    const container = document.getElementById('popular-recipes-container');
    if (!container) return;

    container.innerHTML = recipes.map(recipe => {
        const description = Object.values(recipe.Pasos).join(' ');
        const shortDescription = description.length > 100 ? description.substring(0, 97) + '...' : description;
        const dificultad = dificultades.find(d => d.id === recipe.idDificultad);
        const nivelDificultad = dificultad ? dificultad.nivel : 'Media';

        return `
        <article class="recipe-card">
          <div class="recipe-card__image-container">
            <img src="${recipe.imagen || './src/assets/recetas-img/tarta-verduras.png'}" alt="${recipe.title}" class="recipe-card__image" onerror="this.src='./src/assets/recetas-img/tarta-verduras.png'">
            <span class="recipe-card__badge">${nivelDificultad}</span>
            <div class="recipe-card__overlay">
              <h3 class="recipe-card__title">${recipe.title}</h3>
              <div class="recipe-card__meta">
                <span class="recipe-card__meta-item">🕒 45 min</span>
                <span class="recipe-card__meta-item">👥 4 porc.</span>
              </div>
            </div>
          </div>
          <div class="recipe-card__content">
            <p class="recipe-card__description">${shortDescription}</p>
            <button class="recipe-card__button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="recipe-card__btn-icon">
                <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"></path>
                <path d="M6 17h12"></path>
              </svg>
              Preparar compra
            </button>
          </div>
        </article>
        `;
    }).join('');
}
