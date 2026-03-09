window.currentLang = 'pt';

function toggleLanguage(lang) {
    window.currentLang = lang;
    localStorage.setItem('selectedLang', lang);

    const allNavs = document.querySelectorAll('.lang-nav');
    const allPtBtns = document.querySelectorAll('.pt-btn');
    const allEnBtns = document.querySelectorAll('.en-btn');

    if (lang === 'en') {
        allNavs.forEach(nav => nav.classList.add('en-active'));
        allPtBtns.forEach(btn => btn.classList.remove('active'));
        allEnBtns.forEach(btn => btn.classList.add('active'));
    } else {
        allNavs.forEach(nav => nav.classList.remove('en-active'));
        allPtBtns.forEach(btn => btn.classList.add('active'));
        allEnBtns.forEach(btn => btn.classList.remove('active'));
    }

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // HOME PAGE
    if (window.renderProperties) window.renderProperties();
    if (window.renderTestimonials) window.renderTestimonials();
    if (window.loadFAQs) window.loadFAQs();

    // DETAILS PAGE
    if (window.renderPropertyDetails) {
        window.renderPropertyDetails();
    }

    // Placeholder
    const inputs = document.querySelectorAll('input[placeholder]');

    inputs.forEach(input => {
        if (input.id === 'search-input') {
            input.placeholder = (lang === 'pt') ? 'Localização (Cidade, Rua...)' : 'Location (City, Street...)';
        } else if (input.id === 'min-price') {
            input.placeholder = (lang === 'pt') ? 'Preço Mín (€)' : 'Min Price (€)';
        } else if (input.id === 'min-area') {
            input.placeholder = (lang === 'pt') ? 'Área Mín (m²)' : 'Min Area (m²)';
        }
    });
}

// AUTO-RUN: This makes sure when the details page opens
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang');
    if (savedLang) {
        toggleLanguage(savedLang);
    }
});