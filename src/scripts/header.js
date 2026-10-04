document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const iconOpen = document.querySelector('.menu-icon-open');
    const iconClose = document.querySelector('.menu-icon-close');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                iconOpen.style.display = 'none';
                iconClose.style.display = 'block';
            } else {
                iconOpen.style.display = 'block';
                iconClose.style.display = 'none';
            }
        });
    }

    // Set active link based on current URL
    const currentPath = window.location.pathname;
    let currentPage = currentPath.split('/').pop();
    if (!currentPage || currentPage === '') currentPage = 'index.html';

    const navLinks = document.querySelectorAll('.nav-page');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
