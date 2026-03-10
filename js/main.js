// MENU MOBILE //
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu-container');

if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
        hamburger.classList.toggle('is-open');
    });

    const mobileLinks = document.querySelectorAll('.nav-links-mobile a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            hamburger.classList.remove('is-open');
        });
    });
}

// ANIMATE ABOUT STATS //
const animateCounters = () => {
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const duration = 2000;
            const increment = target / (duration / 10);

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// PROPERTIES GRID //
window.renderProperties = function (data = properties, limit = null) {
    const container = document.getElementById('properties-container');
    if (!container) return;

    container.innerHTML = '';
    const lang = window.currentLang || 'pt';

    // Safety check if properties.js didn't load
    if (typeof data === 'undefined' || !data) return;

    const displayList = limit ? data.slice(0, limit) : data;

    if (displayList.length === 0) {
        container.innerHTML = `<div class="no-results"><p>Nenhum imóvel encontrado.</p></div>`;
        return;
    }

    displayList.forEach(property => {
        const title = property.title[lang];
        const type = property.type[lang];
        const location = property.location[lang];
        const price = property.price[lang];

        const cardHTML = `
        <a href="${property.link}?ref=${property.ref}" class="property-card-link">
            <div class="property-card">
                <div class="property-media">
                    <img src="${property.image}" alt="property" />
                    <div class="property-type">${type}</div>
                </div>
                <div class="property-info">
                    <address class="location">
                        <img src="assets/pin-house.svg" alt="icon" />
                        <p>${location}</p>
                    </address>
                    <h3>${title}</h3>
                    <div class="details-group">
                        ${property.beds ? `<div class="spec-item"><img src="assets/bed.svg" /><p>${property.beds}</p></div>` : ''}
                        ${property.baths ? `<div class="spec-item"><img src="assets/bath.svg" /><p>${property.baths}</p></div>` : ''}
                        ${property.sqm ? `<div class="spec-item"><img src="assets/size.svg" /><p>${property.sqm} m&sup2;</p></div>` : ''}
                    </div>
                    <div class="price"><p>${price}</p></div>
                </div>
            </div>
        </a>`;
        container.innerHTML += cardHTML;
    });
};

// CONTACT FORM //
async function sendContactForm(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('contact-form');
    const formData = new FormData(form);

    try {
        const response = await fetch("https://formspree.io/f/mbdaeazl", {
            method: "POST",
            body: formData, 
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = "obrigado.html";
        } else {
            console.error("Formspree error:", await response.text());
            alert("Erro ao enviar.");
        }
    } catch (error) {
        console.error("Submission error:", error);
    }
}

// FILTERING //
window.applyFilters = function () {
    const filters = {
        status: document.getElementById('status-filter')?.value || 'all',
        targetType: document.getElementById('property-type-filter')?.value || 'all',
        search: document.getElementById('search-input')?.value.toLowerCase() || '',
        minPrice: parseFloat(document.getElementById('min-price')?.value) || 0,
        maxPrice: parseFloat(document.getElementById('max-price')?.value) || Infinity,
        rooms: document.getElementById('bedrooms-filter')?.value || 'all',
        baths: document.getElementById('bathrooms-filter')?.value || 'all',
        minArea: parseFloat(document.getElementById('min-area')?.value) || 0,
        maxArea: parseFloat(document.getElementById('max-area')?.value) || Infinity,
        energy: document.getElementById('energy-filter')?.value || 'all',
        parking: document.getElementById('parking-filter')?.value || 'all',
        sort: document.getElementById('price-sort')?.value || 'default'
    };

    let filtered = properties.filter(prop => {
        const lang = window.currentLang || 'pt';

        const priceStr = String(prop.price || "");
        const numericPrice = parseFloat(priceStr.replace(/[^\d]/g, '')) || 0;

        // Status Filter
        const matchesStatus = (filters.status === 'all') || (prop.status === filters.status);

        // Look at the STRING targetType instead of the OBJECT type
        const matchesType = (filters.targetType === 'all') || (prop.targetType === filters.targetType);

        // Search Filter
        const matchesSearch = prop.location[lang].toLowerCase().includes(filters.search) ||
            prop.title[lang].toLowerCase().includes(filters.search);

        // Numeric Ranges
        const matchesPrice = (numericPrice >= filters.minPrice && numericPrice <= filters.maxPrice);
        const matchesArea = (prop.sqm || 0) >= filters.minArea && (prop.sqm || 0) <= filters.maxArea;

        // Rooms and Baths
        const matchesRooms = (filters.rooms === 'all') ||
            (filters.rooms === '4' ? (prop.beds || 0) >= 4 : (prop.beds || 0) == filters.rooms);

        const matchesBaths = (filters.baths === 'all') ||
            (filters.baths === '4' ? (prop.baths || 0) >= 4 : (prop.baths || 0) == filters.baths);

        // Technicals
        let matchesEnergy = false;
        if (filters.energy === 'all') {
            matchesEnergy = true;
        } else if (filters.energy === 'C') {
            // This now correctly accepts C, D, E, F, or G
            const lowGrades = ['C', 'D', 'E', 'F', 'G'];
            matchesEnergy = lowGrades.includes(prop.energyClass);
        } else {
            // This handles A and B
            matchesEnergy = (prop.energyClass === filters.energy);
        }

        const matchesParking = (filters.parking === 'all') ||
            (filters.parking === 'yes' ? prop.hasParking === true : prop.hasParking === false);

        return matchesStatus && matchesType && matchesSearch && matchesPrice &&
            matchesArea && matchesRooms && matchesBaths && matchesEnergy && matchesParking;
    });

    if (filters.sort !== 'default') {
        filtered.sort((a, b) => {
            const pA = parseFloat(String(a.price).replace(/[^\d]/g, '')) || 0;
            const pB = parseFloat(String(b.price).replace(/[^\d]/g, '')) || 0;
            return filters.sort === 'low-high' ? pA - pB : pB - pA;
        });
    }

    window.renderProperties(filtered);
};

window.clearFilters = function () {
    // Reset all Select dropdowns
    const selects = document.querySelectorAll('.properties-filter-container select');
    selects.forEach(select => {
        if (select.id === 'price-sort') {
            select.value = 'default';
        } else {
            select.value = 'all';
        }
    });

    // Clear all Input fields
    const inputs = document.querySelectorAll('.properties-filter-container input');
    inputs.forEach(input => {
        input.value = '';
    });

    // Re-render the full list of properties
    window.renderProperties(properties);
};

// TESTIMONIALS GRID //
window.renderTestimonials = function () {
    const testimonialContainer = document.getElementById('testimonial-card');
    if (!testimonialContainer || typeof testimonials === 'undefined') return;

    testimonialContainer.innerHTML = '';
    const lang = window.currentLang || 'pt';

    testimonials.forEach(testimonial => {
        const newCard = document.createElement('div');
        newCard.classList.add('testimonial-card-single');
        newCard.innerHTML = `
            <div class="testimonial-stars">
                ${'<img src="assets/star.svg" alt="star">'.repeat(5)}
            </div>
            <div class="testimonial-content">
                <p>"${testimonial.content[lang]}"</p>
            </div>
            <div class="testimonial-name">
                <h6>${testimonial.name}</h6>
            </div>
        `;
        testimonialContainer.appendChild(newCard);
    });
};

// FAQs //
window.loadFAQs = function () {
    const faqList = document.getElementById('faq-list');
    if (!faqList || typeof faqs === 'undefined') return;

    const lang = window.currentLang || 'pt';

    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <button class="faq-question">
                ${faq.question[lang]}
                <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
                <p>${faq.answer[lang]}</p>
            </div>
        </div>
    `).join('');

    faqList.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.classList.toggle('active');
        });
    });
};

// CONSOLIDATED INITIALIZATION //
document.addEventListener('DOMContentLoaded', () => {
    // Check Page Type
    const isPropertiesPage = !!document.getElementById('status-filter');

    // Load Properties
    if (typeof properties !== 'undefined') {
        if (isPropertiesPage) {
            window.renderProperties(properties); // Show all
            const filters = document.querySelectorAll('.properties-filter-container input, .properties-filter-container select');
            filters.forEach(input => input.addEventListener('input', window.applyFilters));
        } else {
            window.renderProperties(properties, 3); // Home Page limit
        }
    }

    // Stats Observer
    const counters = document.querySelectorAll('.count');
    if (counters.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        const target = document.querySelector('.stats-container') || counters[0];
        statsObserver.observe(target);
    }

    // Clear Filters
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', window.clearFilters);
    }

    // Load others
    window.renderTestimonials();
    window.loadFAQs();
});