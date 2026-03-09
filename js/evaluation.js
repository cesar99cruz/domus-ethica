class EvaluationForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = { amenities: [] };
        this.container = document.getElementById('form-container');
        this.render();
    }

    // Saves text, select, and number inputs to formData
    updateField(name, value) {
        this.formData[name] = value;
        console.log("Form Progress:", this.formData);
    }

    // Toggles amenity selection
    toggleAmenity(el) {
        el.classList.toggle('active');
        const active = document.querySelectorAll('.amenity-option.active');
        this.formData.amenities = Array.from(active).map(a => a.dataset.value);
    }

    render() {
        // Update progress bar
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = `${progress}%`;

        // Inject the new step HTML
        this.container.innerHTML = this.getStepContent(this.currentStep);

        // THIS IS THE FIX:
        // Call the function that ALREADY exists in your lang-change.js
        // We pass window.currentLang so it remembers the user's choice.
        if (typeof toggleLanguage === 'function') {
            toggleLanguage(window.currentLang);
        }
    }

    getStepContent(step) {
        switch (step) {
            case 1:
                return `
                <div class="step-fade-in">
                    <h2 class="step1-title" data-translate="eval_title_1">Venda a Sua Propriedade</h2>
                    <p class="step1-pgh" data-translate="eval_desc_1">Quer saber quanto vale a sua propriedade?</p>
                    <div class="form-navigation-center">
                        <button class="btn-primary" onclick="app.next()"><img src="assets/chevron-right.svg" alt="next-button"/></button>
                    </div>
                </div>
            `;

            case 2:
                const amenities = [
                    { id: 'varanda', label: 'Varanda', key: 'amenity_balcony', img: 'assets/eval_form/balcony.svg' },
                    { id: 'elevador', label: 'Elevador', key: 'amenity_elevator', img: 'assets/eval_form/elevator.svg' },
                    { id: 'garagem', label: 'Garagem', key: 'amenity_garage', img: 'assets/eval_form/garage.svg' },
                    { id: 'jardim', label: 'Jardim', key: 'amenity_garden', img: 'assets/eval_form/garden.svg' },
                    { id: 'estacionamento', label: 'Estacionamento', key: 'amenity_parking', img: 'assets/eval_form/parking.svg' },
                    { id: 'arrecadacao', label: 'Arrecadação', key: 'amenity_storage', img: 'assets/eval_form/storage.svg' },
                    { id: 'piscina', label: 'Piscina', key: 'amenity_pool', img: 'assets/eval_form/pool.svg' },
                    { id: 'terraco', label: 'Terraço', key: 'amenity_terrace', img: 'assets/eval_form/terrace.svg' },
                    { id: 'licenca', label: 'Licença turística', key: 'amenity_license', img: 'assets/eval_form/license.svg' }
                ];
                return `
                <div class="step-fade-in">
                    <h2 data-translate="eval_title_2">Que comodidades adicionais tem a sua propriedade?</h2>
                    <div class="amenities-grid">
                        ${amenities.map(item => `
                            <div class="amenity-option ${this.formData.amenities.includes(item.id) ? 'active' : ''}" 
                                 data-value="${item.id}" onclick="app.toggleAmenity(this)">
                                <img src="${item.img}" alt="${item.label}" class="amenity-icon" style="width:40px; pointer-events:none;">
                                <p data-translate="${item.key}">${item.label}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="form-navigation">
                        <button class="btn-secondary" onclick="app.prev()"><img src="assets/chevron-left.svg" alt="back-button"/></button>
                        <button class="btn-primary" onclick="app.next()"><img src="assets/chevron-right.svg" alt="next-button"/></button>
                    </div>
                </div>
            `;

            case 3:
                return `
                <div class="step-fade-in">
                    <h2 data-translate="eval_title_3">Descreva a sua Propriedade</h2>
                    <div class="property-details-grid">
                        <div class="form-group">
                            <label data-translate="label_prop_type">Tipo de Propriedade*</label>
                            <select name="property_type" onchange="app.updateField(this.name, this.value)">
                                <option value="" data-translate="opt_select">Selecione</option>
                                <option value="apartment" data-translate="opt_apartment">Apartamento</option>
                                <option value="house" data-translate="opt_house">Moradia</option>
                                <option value="building" data-translate="opt_building">Edifício</option>
                                <option value="farm" data-translate="opt_farm">Quinta / Herdade</option>
                                <option value="shop" data-translate="opt_shop">Loja</option>
                                <option value="warehouse" data-translate="opt_warehouse">Armazém</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label data-translate="label_condition">Condição*</label>
                            <select name="condition" onchange="app.updateField(this.name, this.value)">
                                <option value="" data-translate="opt_select">Selecione</option>
                                <option value="new" data-translate="opt_new">Novo</option>
                                <option value="used" data-translate="opt_used">Usado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label data-translate="label_bedrooms">Número de Quartos*</label>
                            <input type="number" name="bedrooms" data-translate-placeholder="ph_bedrooms" placeholder="Ex: 3" oninput="app.updateField(this.name, this.value)">
                        </div>
                        <div class="form-group">
                            <label data-translate="label_bathrooms">Casas de Banho*</label>
                            <input type="number" name="bathrooms" data-translate-placeholder="ph_bathrooms" placeholder="Ex: 2" oninput="app.updateField(this.name, this.value)">
                        </div>
                        <div class="form-group">
                            <label data-translate="label_built_area">Área de Construção (m²)</label>
                            <input type="number" name="built_area" data-translate-placeholder="ph_m2" placeholder="em m²" oninput="app.updateField(this.name, this.value)">
                        </div>
                        <div class="form-group">
                            <label data-translate="label_land_area">Área do Terreno (m²)</label>
                            <input type="number" name="land_area" data-translate-placeholder="ph_m2" placeholder="em m²" oninput="app.updateField(this.name, this.value)">
                        </div>
                        <div class="form-group">
                            <label data-translate="label_location">Localização Propriedade</label>
                            <input type="text" name="local_area" data-translate-placeholder="ph_location" placeholder="Ex: Cascais" oninput="app.updateField(this.name, this.value)">
                        </div>
                    </div>
                    <div class="form-navigation">
                        <button class="btn-secondary" onclick="app.prev()"><img src="assets/chevron-left.svg" alt="back-button"/></button>
                        <button class="btn-primary" onclick="app.next()"><img src="assets/chevron-right.svg" alt="next-button"/></button>
                    </div>
                </div>
            `;

            case 4:
                return `
                <div class="step-fade-in">
                    <h2 data-translate="eval_title_4">Informação de Contacto</h2>
                    <p data-translate="eval_desc_4">Deixe os seus dados para receber a avaliação.</p>
                    <div class="contact-grid">
                        <div class="form-group">
                            <label data-translate="label_name">Nome Completo*</label>
                            <input type="text" name="user_name" data-translate-placeholder="ph_name" placeholder="Nome" required oninput="app.updateField(this.name, this.value)">
                        </div>
                        <div class="form-group">
                            <label data-translate="label_email">Email*</label>
                            <input type="email" name="user_email" data-translate-placeholder="ph_email" placeholder="email@email.com" required oninput="app.updateField(this.name, this.value)">
                        </div>
                        <div class="form-group">
                            <label data-translate="label_phone">Telemóvel*</label>
                            <input type="tel" name="user_phone" data-translate-placeholder="ph_phone" placeholder="+351 ..." required oninput="app.updateField(this.name, this.value)">
                        </div>
                    </div>
                    <div class="form-navigation">
                        <button class="btn-secondary" onclick="app.prev()"><img src="assets/chevron-left.svg" alt="back-button"/></button>
                        <button class="btn-end" data-translate="btn_submit" onclick="app.submit()">Enviar Pedido</button>
                    </div>
                </div>
            `;
        }
    }

    next() { if (this.currentStep < this.totalSteps) { this.currentStep++; this.render(); } }
    prev() { if (this.currentStep > 1) { this.currentStep--; this.render(); } }

    async submit() {
        // This is the endpoint you just shared
        const endpoint = "https://formspree.io/f/mlgpgpvb";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // This sends all your collected form data to Formspree
                body: JSON.stringify(this.formData)
            });

            if (response.ok) {
                alert("Obrigado! A avaliação foi enviada.");
                // Send her to your 'obrigado.html'
                window.location.href = "obrigado.html";
            } else {
                alert("Erro ao enviar. Tente novamente.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
        }
    }
}

const app = new EvaluationForm();