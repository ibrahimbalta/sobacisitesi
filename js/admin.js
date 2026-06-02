/* ==========================================================================
   KUMRU SOBA - PREMIUM ADMIN PANEL YÖNETİM SİSTEMİ (JS)
   Yazar: Antigravity
   Açıklama: Form yönetimi, localStorage senkronizasyonu, Ürün/Tarihçe CRUD,
             JSON içe/dışa aktarım ve kalıcı kod oluşturma motoru.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // AUTH / LOGIN SYSTEM
    // ==========================================================================
    const STORAGE_AUTH_KEY    = 'kumru_admin_auth';
    const STORAGE_PW_KEY      = 'kumru_admin_pw';
    const DEFAULT_PASSWORD    = 'kumru1987';

    const loginOverlay   = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm      = document.getElementById('login-form');
    const loginCard      = document.querySelector('.login-card');
    const pwInput        = document.getElementById('admin-password');
    const btnTogglePw    = document.getElementById('btn-toggle-pw');

    // Inject error message element into login card (after form)
    const loginErrorMsg = document.createElement('div');
    loginErrorMsg.id = 'login-error-msg';
    loginErrorMsg.className = 'login-error-msg';
    loginErrorMsg.textContent = 'Hatalı şifre! Lütfen tekrar deneyin.';
    loginCard.appendChild(loginErrorMsg);

    // Check session — if already logged in, skip login screen
    function checkAuthAndShow() {
        const isAuthenticated = sessionStorage.getItem(STORAGE_AUTH_KEY) === '1';
        if (isAuthenticated) {
            loginOverlay.classList.add('hidden');
            adminDashboard.style.display = 'flex';
        } else {
            loginOverlay.classList.remove('hidden');
            adminDashboard.style.display = 'none';
        }
    }

    // Login form submit handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPw  = pwInput.value;
        const savedPw    = localStorage.getItem(STORAGE_PW_KEY) || DEFAULT_PASSWORD;

        if (enteredPw === savedPw) {
            sessionStorage.setItem(STORAGE_AUTH_KEY, '1');
            loginErrorMsg.classList.remove('active');
            // Animate login card out, then reveal dashboard
            loginCard.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            loginCard.style.opacity    = '0';
            loginCard.style.transform  = 'scale(0.95) translateY(-20px)';
            setTimeout(() => {
                loginOverlay.classList.add('hidden');
                adminDashboard.style.display = 'flex';
                // Reset card state for potential re-login later
                loginCard.style.opacity   = '';
                loginCard.style.transform = '';
                pwInput.value = '';
            }, 400);
        } else {
            // Show error + shake animation
            loginErrorMsg.classList.add('active');
            loginCard.classList.remove('shake');
            void loginCard.offsetWidth; // reflow to restart animation
            loginCard.classList.add('shake');
            pwInput.value = '';
            pwInput.focus();
        }
    });

    // Show/hide password toggle
    if (btnTogglePw) {
        btnTogglePw.addEventListener('click', () => {
            const isPassword = pwInput.type === 'password';
            pwInput.type = isPassword ? 'text' : 'password';
            btnTogglePw.querySelector('i').className = isPassword
                ? 'fa-solid fa-eye-slash'
                : 'fa-solid fa-eye';
        });
    }

    // Logout button
    const btnLogout = document.getElementById('btn-admin-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem(STORAGE_AUTH_KEY);
            adminDashboard.style.display = 'none';
            loginOverlay.classList.remove('hidden');
            // Reset login overlay card animation
            loginCard.style.animation = 'none';
            void loginCard.offsetWidth;
            loginCard.style.animation = '';
        });
    }

    // Run auth check immediately
    checkAuthAndShow();

    // 1. Durum ve Veri Yönetimi (State Management)
    const defaultSiteContent = {
        hero: {
            trBadge: "1987'den Bugüne Ustalıkla",
            enBadge: "Craftsmanship Since 1987",
            trTitle: "Sıcak Yuvaların Geleneksel Sırrı: <span>Kumru Kuzineleri</span>",
            enTitle: "Traditional Secret of Cozy Homes: <span>Kumru Stoves</span>",
            trDesc: "Ordu'nun Kumru ilçesinde, döküm demir ve dayanıklı emayeyi usta işçilikle birleştiriyoruz. Evinize hem kış sıcaklığı hem de fırın lezzeti getiriyoruz.",
            enDesc: "In Kumru, Ordu, we combine heavy cast iron and durable enamel with master craftsmanship. Bringing both winter warmth and bakery flavor to your home.",
            trBtnCustom: "Kendi Sobanı Tasarla",
            enBtnCustom: "Design Your Stove",
            trBtnCatalog: "Kataloğu İncele",
            enBtnCatalog: "View Catalog",
            stats: [
                { id: "stat-exp", val: "39+", trLbl: "Yıllık Deneyim", enLbl: "Years Experience" },
                { id: "stat-craft", val: "100%", trLbl: "Usta İşçilik", enLbl: "Master Craftsmen" },
                { id: "stat-export", val: "12+", trLbl: "Ülkeye Gönderim", enLbl: "Countries Exported" }
            ]
        },
        products: [
            {
                id: "somine",
                trTag: "En Çok Satan",
                enTag: "Best Seller",
                image: "/images/soba-somine.png",
                trTitle: "Altın Süslü Kuzine",
                enTitle: "Golden Kuzine",
                trDesc: "Geleneksel motifler, el işçiliği altın sarısı döküm köşeler ve Kumru Soba kabartma amblemiyle usta işi, en prestijli otantik kuzine modelimiz.",
                enDesc: "Traditional motifs, handcrafted golden cast corners and embossed Kumru Soba emblem, our master-made most prestigious authentic kuzine model.",
                price: 18500,
                specs: [
                    { icon: "fa-arrows-left-right", trLabel: "Ebatlar", enLabel: "Dimensions", val: "80x50x70 cm" },
                    { icon: "fa-weight-hanging", trLabel: "Ağırlık", enLabel: "Weight", val: "75 Kg" },
                    { icon: "fa-utensils", trLabel: "Fırın Ebatı", enLabel: "Oven Size", val: "42x42x20 cm" },
                    { icon: "fa-house", trLabel: "Isıtma Hacmi", enLabel: "Heating Capacity", val: "~75 m²" }
                ]
            },
            {
                id: "klasik",
                trTag: "Geleneksel",
                enTag: "Traditional",
                image: "/images/soba-klasik.png",
                trTitle: "Klasik Kuzine",
                enTitle: "Classic Kuzine",
                trDesc: "Kumru'nun meşhur kara sac kuzine tasarımı. Isıyı anında dışarı veren yüksek verimli dayanıklı sac gövde, geniş yakma haznesi ve geleneksel pişirme fırınıyla nostaljik ve güçlü.",
                enDesc: "Kumru's famous black sheet metal stove design. nostalgic and strong with its high-efficiency durable sheet metal body that transmits heat immediately, wide combustion chamber and traditional baking oven.",
                price: 12000,
                specs: [
                    { icon: "fa-arrows-left-right", trLabel: "Ebatlar", enLabel: "Dimensions", val: "85x50x70 cm" },
                    { icon: "fa-weight-hanging", trLabel: "Ağırlık", enLabel: "Weight", val: "80 Kg" },
                    { icon: "fa-utensils", trLabel: "Fırın Ebatı", enLabel: "Oven Size", val: "45x45x20 cm" },
                    { icon: "fa-house", trLabel: "Isıtma Hacmi", enLabel: "Heating Capacity", val: "~70 m²" }
                ]
            },
            {
                id: "kovali",
                trTag: "Yüksek Güç",
                enTag: "High Power",
                image: "/images/soba-kovali.png",
                trTitle: "Fanlı Soba",
                enTitle: "Fanned Stove",
                trDesc: "Geniş atölyeler, kafeler, restoranlar ve yüksek tavanlı alanlar için özel ısı boruları ve dahili 220V fan üfleme sistemiyle donatılmış ultra güçlü katı yakıtlı ısıtma sistemimiz.",
                enDesc: "Our ultra-powerful solid-fuel heating system equipped with special heat pipes and built-in 220V fan blowing system for large workshops, cafes, restaurants and high-ceilinged areas.",
                price: 21000,
                specs: [
                    { icon: "fa-arrows-left-right", trLabel: "Ebatlar", enLabel: "Dimensions", val: "60x60x135 cm" },
                    { icon: "fa-weight-hanging", trLabel: "Ağırlık", enLabel: "Weight", val: "140 Kg" },
                    { icon: "fa-wind", trLabel: "Boru Tesisatı", enLabel: "Piping Set", val: "18 Isı Borusu / 220V Fan" },
                    { icon: "fa-house", trLabel: "Isıtma Hacmi", enLabel: "Heating Capacity", val: "~250 m²" }
                ]
            },
            {
                id: "kat-kaloriferi",
                trTag: "100% Yerli Üretim",
                enTag: "100% Domestic Production",
                image: "/images/kat-kaloriferi.png",
                trTitle: "Kat Kaloriferi",
                enTitle: "Floor Heating Boiler",
                trDesc: "Dijital kontrol paneli, otomatik sıcaklık ayarı ve çift daire ısıtma gücüne sahip %100 yerli üretim katı yakıtlı kat kaloriferi. Apartman ve müstakil evler için ideal merkezi ısıtma çözümü.",
                enDesc: "100% domestic production solid fuel floor heating boiler with digital control panel, automatic temperature control, and dual-apartment heating power. Ideal central heating solution for apartments and detached houses.",
                price: 28500,
                specs: [
                    { icon: "fa-arrows-left-right", trLabel: "Ebatlar", enLabel: "Dimensions", val: "50x60x110 cm" },
                    { icon: "fa-weight-hanging", trLabel: "Ağırlık", enLabel: "Weight", val: "160 Kg" },
                    { icon: "fa-temperature-half", trLabel: "Kontrol", enLabel: "Control", val: "Dijital Panel / Otomatik" },
                    { icon: "fa-building", trLabel: "Isıtma Gücü", enLabel: "Heating Power", val: "2 Daire Kapasiteli" }
                ]
            }
        ],
        timeline: [
            {
                year: "1987",
                trTitle: "Atölyenin Temeli",
                enTitle: "Foundation of the Shop",
                trDesc: "Ordu Kumru'da usta demirciler tarafından ilk el yapımı kuzine üretildi.",
                enDesc: "The first handmade kuzine was produced by master blacksmiths in Kumru, Ordu."
            },
            {
                year: "2005",
                trTitle: "Markalaşma ve Emaye Devrimi",
                enTitle: "Branding & Enamel Revolution",
                trDesc: "Ürünlerin dayanıklılığını artırmak için yüksek ısı emaye kaplama teknolojisine geçildi.",
                enDesc: "Adopted high-temperature enamel coating tech to double product longevity."
            },
            {
                year: "2018",
                trTitle: "Şömine Serisi",
                enTitle: "Fireplace Series",
                trDesc: "Büyük camlı, şömine görünümlü modern döküm kuzineler ürün gamına eklendi.",
                enDesc: "Modern cast kuzines with large ceramic glass doors added to product lineup."
            },
            {
                year: "2026",
                trTitle: "Geleceğe Sıcaklık",
                enTitle: "Warmth Into Future",
                trDesc: "Online sipariş altyapısı ve yenilenen modern vizyonumuzla sıcacık yuvalar kurmaya devam ediyoruz.",
                enDesc: "Continuing to build warm homes with online order options and a modern brand vision."
            }
        ],
        contact: {
            trAddress: "Kadıncık, Şehit Neşe Küme Evleri No: 1, 52800 Kumru/Ordu",
            enAddress: "Kadincik, Sehit Nese Kume Evleri No: 1, 52800 Kumru/Ordu, Turkey",
            phone: "+90 534 245 79 08",
            phoneRaw: "905342457908",
            email: "info@kumrusoba.com",
            facebook: "https://www.facebook.com/p/Kumru-Soba-100054214401827/?locale=tr_TR",
            instagram: "https://www.instagram.com/kumrusoba/",
            whatsapp: "https://wa.me/905342457908",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.6893663673756!2d37.2608466765792!3d41.0320475175908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4062a4d339396fb9%3A0xe54e6012cc4a71bf!2zS2FkxLFuycWxrSwgxZ9odC4gTmXFn2UgS8O8bWUgRXY!5e0!3m2!1str!2str!4v1717281000000!5m2!1str!2str"
        }
    };

    let activeState = JSON.parse(localStorage.getItem('kumru_site_content')) || defaultSiteContent;

    // Toast Notification System
    function showToast(message, type = 'success') {
        const wrapper = document.getElementById('toast-wrapper');
        if (!wrapper) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-exclamation';
        if (type === 'warning') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        
        wrapper.appendChild(toast);

        // Slide out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // Tab Navigation switching
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabTitle = document.getElementById('current-tab-title');
    const tabDesc = document.getElementById('current-tab-desc');

    const tabDetails = {
        hero: { title: "Genel & Kahraman Yönetimi", desc: "Ana sayfanın giriş başlıklarını, karşılama yazılarını ve istatistik alanlarını güncelleyin." },
        products: { title: "Ürün Kataloğu Yönetimi", desc: "Sitede gösterilen döküm, emaye kuzineler ve kaloriferlerin fiyatlarını ve görsellerini yönetin." },
        timeline: { title: "Tarihçe & Zaman Tüneli", desc: "1987'den bugüne uzanan kurumsal serüveninizi ve başarı kilometre taşlarını düzenleyin." },
        contact: { title: "İletişim & Harita Bilgileri", desc: "Telefon, e-posta, WhatsApp, sosyal medya hesapları ve Google Maps konum bilgisini güncelleyin." },
        backup: { title: "Veri Yönetimi & Kalıcı Kaydetme", desc: "Tüm özelleştirmelerinizi yedekleyin, içe aktarın veya kalıcı kaynak kodu oluşturun." }
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabKey = item.getAttribute('data-tab');
            
            navItems.forEach(i => i.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(`panel-${tabKey}`).classList.add('active');
            
            tabTitle.textContent = tabDetails[tabKey].title;
            tabDesc.textContent = tabDetails[tabKey].desc;
        });
    });

    // Load state values into Form inputs
    function loadStateIntoForms() {
        // Hero TR
        document.getElementById('hero-badge-tr').value = activeState.hero.trBadge || '';
        document.getElementById('hero-title-tr').value = activeState.hero.trTitle || '';
        document.getElementById('hero-desc-tr').value = activeState.hero.trDesc || '';
        document.getElementById('hero-btn-custom-tr').value = activeState.hero.trBtnCustom || '';
        document.getElementById('hero-btn-catalog-tr').value = activeState.hero.trBtnCatalog || '';
        // Hero EN
        document.getElementById('hero-badge-en').value = activeState.hero.enBadge || '';
        document.getElementById('hero-title-en').value = activeState.hero.enTitle || '';
        document.getElementById('hero-desc-en').value = activeState.hero.enDesc || '';
        document.getElementById('hero-btn-custom-en').value = activeState.hero.enBtnCustom || '';
        document.getElementById('hero-btn-catalog-en').value = activeState.hero.enBtnCatalog || '';

        // Stats
        document.getElementById('stat-1-val').value = activeState.hero.stats[0].val || '';
        document.getElementById('stat-1-tr').value = activeState.hero.stats[0].trLbl || '';
        document.getElementById('stat-1-en').value = activeState.hero.stats[0].enLbl || '';

        document.getElementById('stat-2-val').value = activeState.hero.stats[1].val || '';
        document.getElementById('stat-2-tr').value = activeState.hero.stats[1].trLbl || '';
        document.getElementById('stat-2-en').value = activeState.hero.stats[1].enLbl || '';

        document.getElementById('stat-3-val').value = activeState.hero.stats[2].val || '';
        document.getElementById('stat-3-tr').value = activeState.hero.stats[2].trLbl || '';
        document.getElementById('stat-3-en').value = activeState.hero.stats[2].enLbl || '';

        // Contact
        document.getElementById('contact-phone').value = activeState.contact.phone || '';
        document.getElementById('contact-phone-raw').value = activeState.contact.phoneRaw || '';
        document.getElementById('contact-email').value = activeState.contact.email || '';
        document.getElementById('contact-wa').value = activeState.contact.whatsapp || '';
        document.getElementById('contact-address-tr').value = activeState.contact.trAddress || '';
        document.getElementById('contact-address-en').value = activeState.contact.enAddress || '';
        document.getElementById('contact-map').value = activeState.contact.mapUrl || '';
        document.getElementById('contact-fb').value = activeState.contact.facebook || '';
        document.getElementById('contact-ig').value = activeState.contact.instagram || '';

        // Render lists
        renderProductsList();
        renderTimelineList();
        generateDeveloperCode();
    }

    // -------------------------------------------------------------
    // PRODUCTS CATALOG CRUD
    // -------------------------------------------------------------
    const productsContainer = document.getElementById('products-list-container');
    const modalProduct = document.getElementById('modal-product');
    const btnAddProduct = document.getElementById('btn-add-product');
    const btnCloseProdModal = document.getElementById('btn-close-prod-modal');
    const btnCancelProd = document.getElementById('btn-cancel-prod');
    const btnSaveProd = document.getElementById('btn-save-prod');

    function renderProductsList() {
        // Clear all except the first Add New card
        const cards = productsContainer.querySelectorAll('.admin-product-card');
        cards.forEach(c => c.remove());

        activeState.products.forEach((prod, index) => {
            const imgSrc = prod.image.startsWith('/') || prod.image.startsWith('http') ? prod.image : '/' + prod.image;
            const card = document.createElement('div');
            card.className = 'admin-product-card';
            card.innerHTML = `
                <div class="admin-product-img">
                    <img src="${imgSrc}" alt="${prod.trTitle}">
                </div>
                <div class="admin-product-details">
                    <div class="admin-product-title">${prod.trTitle}</div>
                    <div class="admin-product-price">${prod.price.toLocaleString('tr-TR')} TL</div>
                    <div class="admin-product-tag">${prod.trTag || 'Etiketsiz'}</div>
                </div>
                <div class="admin-product-actions">
                    <button class="btn-action-circle edit" data-index="${index}" title="Düzenle"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-action-circle delete" data-index="${index}" title="Sil"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            productsContainer.insertBefore(card, btnAddProduct);
        });

        // Attach event listeners
        productsContainer.querySelectorAll('.btn-action-circle.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                openProductModal(idx);
            });
        });

        productsContainer.querySelectorAll('.btn-action-circle.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (confirm('Bu ürünü katalogdan silmek istediğinize emin misiniz?')) {
                    activeState.products.splice(idx, 1);
                    renderProductsList();
                    showToast('Ürün listeden silindi. Değişikliklerin kalıcı olması için sağ üstten KAYDEDİN.', 'warning');
                    generateDeveloperCode();
                }
            });
        });
    }

    function openProductModal(index = null) {
        const isEdit = index !== null;
        document.getElementById('prod-form-index').value = isEdit ? index : '';
        document.getElementById('modal-product-title').textContent = isEdit ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle';
        document.getElementById('btn-save-prod').textContent = isEdit ? 'Değişiklikleri Güncelle' : 'Ürünü Listeye Ekle';

        if (isEdit) {
            const prod = activeState.products[index];
            document.getElementById('prod-form-id').value = prod.id;
            document.getElementById('prod-form-id').readOnly = true; // Protect IDs for customizer integrity
            document.getElementById('prod-form-price').value = prod.price;
            document.getElementById('prod-form-image').value = prod.image;
            
            document.getElementById('prod-form-title-tr').value = prod.trTitle;
            document.getElementById('prod-form-tag-tr').value = prod.trTag || '';
            document.getElementById('prod-form-desc-tr').value = prod.trDesc;

            document.getElementById('prod-form-title-en').value = prod.enTitle;
            document.getElementById('prod-form-tag-en').value = prod.enTag || '';
            document.getElementById('prod-form-desc-en').value = prod.enDesc;

            // Spec 1
            document.getElementById('spec-val-1').value = prod.specs[0]?.val || '';
            // Spec 2
            document.getElementById('spec-val-2').value = prod.specs[1]?.val || '';
            // Spec 3
            document.getElementById('spec-icon-3').value = prod.specs[2]?.icon || 'fa-utensils';
            document.getElementById('spec-tr-label-3').value = prod.specs[2]?.trLabel || 'Fırın Ebatı';
            document.getElementById('spec-en-label-3').value = prod.specs[2]?.enLabel || 'Oven Size';
            document.getElementById('spec-val-3').value = prod.specs[2]?.val || '';
            // Spec 4
            document.getElementById('spec-icon-4').value = prod.specs[3]?.icon || 'fa-house';
            document.getElementById('spec-tr-label-4').value = prod.specs[3]?.trLabel || 'Isıtma Hacmi';
            document.getElementById('spec-en-label-4').value = prod.specs[3]?.enLabel || 'Heating Capacity';
            document.getElementById('spec-val-4').value = prod.specs[3]?.val || '';
        } else {
            // Reset fields
            document.getElementById('prod-form-id').value = '';
            document.getElementById('prod-form-id').readOnly = false;
            document.getElementById('prod-form-price').value = '';
            document.getElementById('prod-form-image').value = '/images/soba-somine.png';
            
            document.getElementById('prod-form-title-tr').value = '';
            document.getElementById('prod-form-tag-tr').value = '';
            document.getElementById('prod-form-desc-tr').value = '';

            document.getElementById('prod-form-title-en').value = '';
            document.getElementById('prod-form-tag-en').value = '';
            document.getElementById('prod-form-desc-en').value = '';

            document.getElementById('spec-val-1').value = '';
            document.getElementById('spec-val-2').value = '';
            
            document.getElementById('spec-icon-3').value = 'fa-utensils';
            document.getElementById('spec-tr-label-3').value = 'Fırın Ebatı';
            document.getElementById('spec-en-label-3').value = 'Oven Size';
            document.getElementById('spec-val-3').value = '';
            
            document.getElementById('spec-icon-4').value = 'fa-house';
            document.getElementById('spec-tr-label-4').value = 'Isıtma Hacmi';
            document.getElementById('spec-en-label-4').value = 'Heating Capacity';
            document.getElementById('spec-val-4').value = '';
        }

        modalProduct.classList.add('active');
    }

    function closeProductModal() {
        modalProduct.classList.remove('active');
    }

    btnAddProduct.addEventListener('click', () => openProductModal());
    btnCloseProdModal.addEventListener('click', closeProductModal);
    btnCancelProd.addEventListener('click', closeProductModal);

    btnSaveProd.addEventListener('click', () => {
        const id = document.getElementById('prod-form-id').value.trim();
        const price = parseInt(document.getElementById('prod-form-price').value);
        const image = document.getElementById('prod-form-image').value.trim();
        
        const titleTr = document.getElementById('prod-form-title-tr').value.trim();
        const tagTr = document.getElementById('prod-form-tag-tr').value.trim();
        const descTr = document.getElementById('prod-form-desc-tr').value.trim();

        const titleEn = document.getElementById('prod-form-title-en').value.trim();
        const tagEn = document.getElementById('prod-form-tag-en').value.trim();
        const descEn = document.getElementById('prod-form-desc-en').value.trim();

        if (!id || isNaN(price) || !titleTr || !descTr) {
            showToast('Lütfen zorunlu alanları (ID, Fiyat, Türkçe Başlık ve Açıklama) doldurun.', 'error');
            return;
        }

        const specs = [
            { icon: "fa-arrows-left-right", trLabel: "Ebatlar", enLabel: "Dimensions", val: document.getElementById('spec-val-1').value.trim() || '80x50x70 cm' },
            { icon: "fa-weight-hanging", trLabel: "Ağırlık", enLabel: "Weight", val: document.getElementById('spec-val-2').value.trim() || '75 Kg' },
            { 
                icon: document.getElementById('spec-icon-3').value.trim() || 'fa-utensils', 
                trLabel: document.getElementById('spec-tr-label-3').value.trim() || 'Fırın Ebatı', 
                enLabel: document.getElementById('spec-en-label-3').value.trim() || 'Oven Size', 
                val: document.getElementById('spec-val-3').value.trim() || '40x40x20 cm' 
            },
            { 
                icon: document.getElementById('spec-icon-4').value.trim() || 'fa-house', 
                trLabel: document.getElementById('spec-tr-label-4').value.trim() || 'Isıtma Hacmi', 
                enLabel: document.getElementById('spec-en-label-4').value.trim() || 'Heating Capacity', 
                val: document.getElementById('spec-val-4').value.trim() || '~75 m²' 
            }
        ];

        const productData = {
            id,
            price,
            image,
            trTag: tagTr,
            enTag: tagEn,
            trTitle: titleTr,
            enTitle: titleEn || titleTr,
            trDesc: descTr,
            enDesc: descEn || descTr,
            specs
        };

        const idxValue = document.getElementById('prod-form-index').value;
        if (idxValue !== '') {
            // Edit
            const index = parseInt(idxValue);
            activeState.products[index] = productData;
            showToast('Ürün başarıyla güncellendi.', 'success');
        } else {
            // Add
            // ID conflict check
            if (activeState.products.some(p => p.id === id)) {
                showToast('Bu ID ile zaten bir ürün tanımlı. Lütfen benzersiz bir ID girin.', 'error');
                return;
            }
            activeState.products.push(productData);
            showToast('Yeni ürün kataloğa eklendi.', 'success');
        }

        closeProductModal();
        renderProductsList();
        generateDeveloperCode();
    });

    // -------------------------------------------------------------
    // TIMELINE / STORY CRUD
    // -------------------------------------------------------------
    const timelineContainer = document.getElementById('timeline-list-container');
    const modalTimeline = document.getElementById('modal-timeline');
    const btnAddTimeline = document.getElementById('btn-add-timeline');
    const btnCloseTimeModal = document.getElementById('btn-close-time-modal');
    const btnCancelTime = document.getElementById('btn-cancel-time');
    const btnSaveTime = document.getElementById('btn-save-time');

    function renderTimelineList() {
        timelineContainer.innerHTML = '';

        activeState.timeline.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'admin-timeline-card';
            card.innerHTML = `
                <div class="admin-timeline-year">${item.year}</div>
                <div class="admin-timeline-details">
                    <div class="admin-timeline-title">${item.trTitle}</div>
                    <div class="admin-timeline-desc">${item.trDesc}</div>
                </div>
                <div class="admin-timeline-actions">
                    <button class="btn-action-circle edit" data-index="${index}" title="Düzenle"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-action-circle delete" data-index="${index}" title="Sil"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            timelineContainer.appendChild(card);
        });

        // Bind clicks
        timelineContainer.querySelectorAll('.btn-action-circle.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                openTimelineModal(idx);
            });
        });

        timelineContainer.querySelectorAll('.btn-action-circle.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (confirm('Bu kilometre taşını tarihçeden silmek istediğinize emin misiniz?')) {
                    activeState.timeline.splice(idx, 1);
                    renderTimelineList();
                    showToast('Kilometre taşı silindi.', 'warning');
                    generateDeveloperCode();
                }
            });
        });
    }

    function openTimelineModal(index = null) {
        const isEdit = index !== null;
        document.getElementById('time-form-index').value = isEdit ? index : '';
        document.getElementById('modal-timeline-title').textContent = isEdit ? 'Tarihçe Adımını Düzenle' : 'Yeni Kilometre Taşı Ekle';
        
        if (isEdit) {
            const item = activeState.timeline[index];
            document.getElementById('time-form-year').value = item.year;
            document.getElementById('time-form-title-tr').value = item.trTitle;
            document.getElementById('time-form-desc-tr').value = item.trDesc;
            document.getElementById('time-form-title-en').value = item.enTitle;
            document.getElementById('time-form-desc-en').value = item.enDesc;
        } else {
            document.getElementById('time-form-year').value = '';
            document.getElementById('time-form-title-tr').value = '';
            document.getElementById('time-form-desc-tr').value = '';
            document.getElementById('time-form-title-en').value = '';
            document.getElementById('time-form-desc-en').value = '';
        }

        modalTimeline.classList.add('active');
    }

    function closeTimelineModal() {
        modalTimeline.classList.remove('active');
    }

    btnAddTimeline.addEventListener('click', () => openTimelineModal());
    btnCloseTimeModal.addEventListener('click', closeTimelineModal);
    btnCancelTime.addEventListener('click', closeTimelineModal);

    btnSaveTime.addEventListener('click', () => {
        const year = document.getElementById('time-form-year').value.trim();
        const titleTr = document.getElementById('time-form-title-tr').value.trim();
        const descTr = document.getElementById('time-form-desc-tr').value.trim();
        
        const titleEn = document.getElementById('time-form-title-en').value.trim();
        const descEn = document.getElementById('time-form-desc-en').value.trim();

        if (!year || !titleTr || !descTr) {
            showToast('Lütfen tüm zorunlu Türkçe alanları doldurun.', 'error');
            return;
        }

        const timelineData = {
            year,
            trTitle: titleTr,
            trDesc: descTr,
            enTitle: titleEn || titleTr,
            enDesc: descEn || descTr
        };

        const idxValue = document.getElementById('time-form-index').value;
        if (idxValue !== '') {
            const index = parseInt(idxValue);
            activeState.timeline[index] = timelineData;
            showToast('Tarihçe adımı güncellendi.', 'success');
        } else {
            activeState.timeline.push(timelineData);
            showToast('Tarihçeye yeni adım eklendi.', 'success');
        }

        closeTimelineModal();
        renderTimelineList();
        generateDeveloperCode();
    });

    // -------------------------------------------------------------
    // GLOBAL SAVE & FORM VALUES COLLECTION
    // -------------------------------------------------------------
    const btnSaveAll = document.getElementById('btn-save-all');

    btnSaveAll.addEventListener('click', () => {
        // Gather Hero data
        activeState.hero.trBadge = document.getElementById('hero-badge-tr').value.trim();
        activeState.hero.trTitle = document.getElementById('hero-title-tr').value.trim();
        activeState.hero.trDesc = document.getElementById('hero-desc-tr').value.trim();
        activeState.hero.trBtnCustom = document.getElementById('hero-btn-custom-tr').value.trim();
        activeState.hero.trBtnCatalog = document.getElementById('hero-btn-catalog-tr').value.trim();

        activeState.hero.enBadge = document.getElementById('hero-badge-en').value.trim();
        activeState.hero.enTitle = document.getElementById('hero-title-en').value.trim();
        activeState.hero.enDesc = document.getElementById('hero-desc-en').value.trim();
        activeState.hero.enBtnCustom = document.getElementById('hero-btn-custom-en').value.trim();
        activeState.hero.enBtnCatalog = document.getElementById('hero-btn-catalog-en').value.trim();

        // Gather Stats
        activeState.hero.stats[0].val = document.getElementById('stat-1-val').value.trim();
        activeState.hero.stats[0].trLbl = document.getElementById('stat-1-tr').value.trim();
        activeState.hero.stats[0].enLbl = document.getElementById('stat-1-en').value.trim();

        activeState.hero.stats[1].val = document.getElementById('stat-2-val').value.trim();
        activeState.hero.stats[1].trLbl = document.getElementById('stat-2-tr').value.trim();
        activeState.hero.stats[1].enLbl = document.getElementById('stat-2-en').value.trim();

        activeState.hero.stats[2].val = document.getElementById('stat-3-val').value.trim();
        activeState.hero.stats[2].trLbl = document.getElementById('stat-3-tr').value.trim();
        activeState.hero.stats[2].enLbl = document.getElementById('stat-3-en').value.trim();

        // Gather Contact
        activeState.contact.phone = document.getElementById('contact-phone').value.trim();
        activeState.contact.phoneRaw = document.getElementById('contact-phone-raw').value.trim();
        activeState.contact.email = document.getElementById('contact-email').value.trim();
        activeState.contact.whatsapp = document.getElementById('contact-wa').value.trim();
        activeState.contact.trAddress = document.getElementById('contact-address-tr').value.trim();
        activeState.contact.enAddress = document.getElementById('contact-address-en').value.trim();
        activeState.contact.mapUrl = document.getElementById('contact-map').value.trim();
        activeState.contact.facebook = document.getElementById('contact-fb').value.trim();
        activeState.contact.instagram = document.getElementById('contact-ig').value.trim();

        // Save to LocalStorage
        localStorage.setItem('kumru_site_content', JSON.stringify(activeState));
        
        showToast('Tüm ayarlar başarıyla kaydedildi! Siteniz güncellendi.', 'success');
        
        generateDeveloperCode();
    });

    // -------------------------------------------------------------
    // BACKUP MANAGEMENT (EXPORT / IMPORT / RESET)
    // -------------------------------------------------------------
    const btnExportJson = document.getElementById('btn-export-json');
    const btnTriggerImport = document.getElementById('btn-trigger-import');
    const importJsonFile = document.getElementById('import-json-file');
    const btnResetDefaults = document.getElementById('btn-reset-defaults');
    const codeBlock = document.getElementById('code-persist-block');
    const btnCopyCode = document.getElementById('btn-copy-code');

    // Export configuration as JSON file
    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeState, null, 4));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "kumru_site_config.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Yapılandırma JSON dosyası indirildi.', 'success');
    });

    // Trigger Import click
    btnTriggerImport.addEventListener('click', () => {
        importJsonFile.click();
    });

    // Read and parse imported JSON
    importJsonFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const importedData = JSON.parse(evt.target.result);
                
                // Simple validation check
                if (!importedData.hero || !importedData.products || !importedData.timeline || !importedData.contact) {
                    showToast('Geçersiz şema yapısı. Lütfen doğru bir Kumru Soba yapılandırma dosyası yükleyin.', 'error');
                    return;
                }

                activeState = importedData;
                localStorage.setItem('kumru_site_content', JSON.stringify(activeState));
                showToast('Yeni yapılandırma başarıyla yüklendi! Panel yenileniyor...', 'success');
                setTimeout(() => location.reload(), 1000);

            } catch (err) {
                showToast('JSON ayrıştırma hatası! Lütfen geçerli bir dosya yükleyin.', 'error');
            }
        };
        reader.readAsText(file);
    });

    // Reset to initial factory defaults
    btnResetDefaults.addEventListener('click', () => {
        if (confirm('Tüm özelleştirmelerinizi silip siteyi fabrika ayarlarına sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            localStorage.removeItem('kumru_site_content');
            showToast('Tüm veriler temizlendi ve orijinal haline getirildi! Yenileniyor...', 'warning');
            setTimeout(() => location.reload(), 1000);
        }
    });

    // Generate Javascript persist code snippet
    function generateDeveloperCode() {
        if (!codeBlock) return;
        const codeString = `const defaultSiteContent = ${JSON.stringify(activeState, null, 4)};`;
        codeBlock.textContent = codeString;
    }

    // Copy persist code block to clipboard
    btnCopyCode.addEventListener('click', () => {
        const range = document.createRange();
        range.selectNode(codeBlock);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        try {
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            showToast('Kaynak kodu panoya kopyalandı! js/app.js içerisine yapıştırabilirsiniz.', 'success');
        } catch (err) {
            showToast('Kopyalama başarısız oldu.', 'error');
        }
    });

    // Change password from within the admin panel (Backup tab)
    const btnChangePassword = document.getElementById('btn-change-password');
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => {
            const newPw = document.getElementById('admin-change-pw-input').value.trim();
            if (!newPw || newPw.length < 4) {
                showToast('Şifre en az 4 karakter olmalıdır.', 'error');
                return;
            }
            localStorage.setItem(STORAGE_PW_KEY, newPw);
            document.getElementById('admin-change-pw-input').value = '';
            showToast('Yönetici şifresi başarıyla güncellendi!', 'success');
        });
    }

    // Initial Load execution
    loadStateIntoForms();
});
