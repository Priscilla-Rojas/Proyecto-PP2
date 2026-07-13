# Frutería Tiziana 🍎🥑

> **“No vendemos solo fruta, vendemos la solución para tu cena”**

🔗 **Sitio web en vivo:** [https://priscilla-rojas.github.io/Proyecto-PP2/](https://priscilla-rojas.github.io/Proyecto-PP2/)

---

Este es el proyecto que desarrollamos para la materia **Práctica Profesionalizante 2 (PP2)** de la carrera **Analista de Sistemas (2do Año)**. La idea era tomar un negocio de barrio y armar la maqueta web de la página de inicio junto con la sección de contacto.

## 👥 Integrantes del Equipo
* **Priscilla Rojas**
* **Tomas Acebedo**

---

## 📝 Sobre el Proyecto

### ¿Cuál es la idea?
Pensamos el proyecto para **Frutería Tiziana**, una verdulería de cercanía. El negocio tiene dos problemas muy comunes:
1. **Pérdida de mercadería:** Es difícil estimar la cantidad exacta de frutas y verduras que se van a vender en el día, lo que a veces genera desperdicio.
2. **Límite geográfico:** Sus clientes son únicamente los vecinos que pasan caminando por el local.

### ¿A quién está dirigido?
Apuntamos a personas de **entre 25 y 70 años** que:
* Cocinan en casa y quieren comer más sano.
* Prefieren la comodidad del envío a domicilio.
* Se inspiran en redes como Instagram o TikTok para cocinar y planifican sus comidas.

### Nuestra Propuesta
Diseñar una web simple y rápida con los precios y ofertas del día actualizados. Además de la venta común con envío a domicilio, sumamos una sección especial de **Recetas Inteligentes** donde el cliente puede elegir un plato, calcular las porciones según la cantidad de personas y agregar todos los ingredientes necesarios en combos accesibles con un solo clic.

---

## 📊 Análisis del Entorno y Contexto

* **Hábitos de consumo:** Hoy en día la gente busca optimizar el tiempo. Después de la pandemia, comprar alimentos de forma online pasó a ser algo cotidiano. También hay una tendencia muy fuerte hacia la alimentación saludable.
* **Situación económica:** Con la volatilidad de precios actual, los clientes cuidan mucho más el bolsillo. Comprar la cantidad exacta para una receta evita que la gente gaste de más y termine tirando comida que se echa a perder.
* **Uso de tecnología:** Todo el mundo usa celular, sabe manejar un carrito de compras y prefiere pagar con billeteras virtuales (como Mercado Pago). El entorno es ideal para una web rápida y fácil de usar.

---

## 🏆 Comparación con la Competencia

* **Verdulerías de barrio (Competencia Directa):** Su única opción digital es tomar pedidos de forma manual por WhatsApp. Suelen mandar fotos de pizarrones con precios desactualizados y es difícil coordinar el envío.
  * *Nuestra ventaja:* **Automatización**. El cliente compra viendo precios reales y el dueño recibe el pedido listo para preparar.
* **Grandes Supermercados (Competencia Indirecta):** Tienen páginas web, pero sus envíos suelen ser caros, tardan días en llegar y la verdura no siempre llega fresca.
  * *Nuestra ventaja:* La **rapidez** de la verdulería de cercanía y una función clave que el súper no tiene: armar el carrito automáticamente según la receta que querés cocinar.
* **Apps de Delivery - Rappi/PedidosYa (Sustitutos):** Te llevan la verdura a casa, pero cobran comisiones altísimas tanto al cliente como al verdulero, lo que encarece los precios.
  * *Nuestra ventaja:* **Canal propio**. Al no tener intermediarios, se pueden mantener precios más competitivos.

---

## 🛠️ Detalles Técnicos y Desarrollo

Para el desarrollo del sitio, aplicamos las pautas técnicas requeridas en la materia:

* **HTML5 Semántico:** Estructuramos el sitio utilizando las etiquetas correctas (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`) para que sea accesible y ordenado.
* **CSS3 Mobile-First:** Diseñamos el sitio pensando primero en pantallas de celulares (desde 320px de ancho) y fuimos escalando el diseño con `@media queries` para que se adapte perfectamente a tablets y monitores de escritorio.
* **Metodología BEM (Block, Element, Modifier):** Escribimos las clases de CSS siguiendo esta convención de nombres para que los estilos sean fáciles de leer, mantener y no se pisen entre sí (por ejemplo, `.product-card`, `.product-card__image`, `.product-card__badge--green`).
* **Vite.js:** Usamos Vite como entorno de desarrollo rápido y para optimizar los assets al generar el sitio final.

---

## 🚀 Alcance de esta entrega (1er Entrega)

Cumpliendo con lo pedido por el profesor para esta entrega, el diseño visual está 100% finalizado y listo en las siguientes páginas:
1. **Página de Inicio (`index.html`):** Contiene la presentación, productos destacados, ofertas del día, sección de recetas y beneficios.
2. **Página de Contacto (`src/pages/contacto.html`):** Formulario de contacto responsive estructurado y validado estéticamente.

---

## 💻 Cómo correr el proyecto en local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 3. Generar la carpeta de producción
```bash
npm run build
```
