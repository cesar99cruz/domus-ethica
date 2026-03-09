// Global variables
let propertyRef, baseInfo, deepInfo;
let currentLang = localStorage.getItem('selectedLang') || 'pt';
let activeIndices = [0, 1, 2]; // Track which images are visible

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    propertyRef = urlParams.get('ref');

    // Find our data
    baseInfo = properties.find(p => p.ref === propertyRef);
    deepInfo = fullPropertyDetails[propertyRef];

    if (baseInfo && deepInfo) {
        renderPropertyDetails();
        renderActiveGallery(); // Call this AFTER deepInfo is defined
    } else {
        document.querySelector('.property-details-page').innerHTML = "<h2>Imóvel não encontrado</h2>";
    }
});

function renderPropertyDetails() {
    const lang = localStorage.getItem('selectedLang') || 'pt';

    document.getElementById('details-title').innerText = baseInfo.title[lang];
    document.getElementById('details-location').innerText = baseInfo.location[lang];
    document.getElementById('details-price').innerText = baseInfo.price;
    document.getElementById('details-description').innerHTML = deepInfo.description[lang];

    // Specs
    const featuresRow = document.getElementById('features-row');
    if (featuresRow && deepInfo.specs) {
        featuresRow.innerHTML = deepInfo.specs.map(spec => {
            const text = spec[lang] || spec;
            return `
            <div class="feature-item">
                <img src="assets/${spec.icon}" alt="" class="feature-icon">
                <span>${text}</span>
            </div>`;
        }).join('');
    }

    // Table
    const tableBox = document.getElementById('areas-lot-container');
    if (tableBox && deepInfo.table) {
        const t = deepInfo.table;
        const trans = translations[lang];
        let tableHTML = `<div class="details-table">`;

        if (t.status) tableHTML += `<div class="table-row"><span class="name-row">${trans.status_label}</span> <span>${t.status[lang]}</span></div><hr>`;
        if (t.type) tableHTML += `<div class="table-row"><span class="name-row">${trans.type_label}</span> <span>${t.type[lang]}</span></div><hr>`;
        if (t.area) tableHTML += `<div class="table-row"><span class="name-row">${trans.area_label}</span> <span>${t.area}</span></div><hr>`;
        if (t.certification) {
            const certVal = typeof t.certification === 'object' ? t.certification[lang] : t.certification;
            tableHTML += `<div class="table-row"><span class="name-row">${trans.certification_label}</span> <span>${certVal}</span></div><hr>`;
        }

        tableHTML += `<div class="table-row"><span class="name-row">${trans.ref_label}</span> <span>${propertyRef}</span></div></div>`;
        tableBox.innerHTML = tableHTML;
    }
}

// HELPER: Detects media and wraps video/button for positioning and rounding
function getMediaHTML(src, extraClass = "") {
    if (!src) return '';
    const isVideo = src.match(/\.(mp4|webm|mov|ogg)$/i);
    
    if (isVideo) {
        // The wrapper is key: it keeps the mute button inside the video box
        return `
            <div class="video-wrapper" style="width:100%; height:100%; position:relative; overflow:hidden; border-radius:15px;">
                <video id="active-video" src="${src}" class="gallery-img ${extraClass}" autoplay muted loop playsinline></video>
                <button class="video-mute-btn" onclick="toggleMute(event)">
                    <img id="mute-icon" src="assets/volume-off.svg" alt="Mute">
                </button>
            </div>`;
    }
    return `<img src="${src}" class="gallery-img ${extraClass}" alt="Property Media">`;
}

// Function to toggle sound - 'event' prevents triggering the gallery change
window.toggleMute = function(event) {
    if (event) event.stopPropagation(); 
    const video = document.getElementById('active-video');
    const icon = document.getElementById('mute-icon');
    
    if (video && icon) {
        video.muted = !video.muted;
        icon.src = video.muted ? "assets/volume-off.svg" : "assets/volume-on.svg";
    }
};

function renderActiveGallery() {
    const mainPhoto = document.getElementById('main-photo-container');
    const sidePhotos = document.getElementById('side-photos-container');

    if (!mainPhoto || !sidePhotos || !deepInfo.gallery) return;

    mainPhoto.innerHTML = getMediaHTML(deepInfo.gallery[activeIndices[0]]);
    sidePhotos.innerHTML = `
        ${getMediaHTML(deepInfo.gallery[activeIndices[1]], "top-side")}
        ${getMediaHTML(deepInfo.gallery[activeIndices[2]], "bottom-side")}
    `;
}

window.changePhoto = function (direction) {
    const totalImages = deepInfo.gallery.length;
    if (totalImages <= 3) return;

    activeIndices = activeIndices.map(index => {
        let nextIndex = index + direction;
        if (nextIndex >= totalImages) return 0;
        if (nextIndex < 0) return totalImages - 1;
        return nextIndex;
    });

    renderActiveGallery();
};