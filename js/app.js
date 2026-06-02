/* ==========================================================================
   KUMRU SOBA - PREMIUM WEB SİTESİ UYGULAMA LOGICAL MOTORU
   Yazar: Antigravity
   Açıklama: Dil yerelleştirme (TR/EN), Soba Özelleştirici, Isı Hesaplayıcı,
             Galeri Lightbox ve Scroll Efektleri yönetim sistemi.
   ========================================================================== */

import { dbRef, hasConfig } from './firebase.js';
import { onValue } from 'firebase/database';

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. DINAMIK SITE ICERIK MODELI VE OYNATICI (Dynamic Content Model)
    // ==========================================
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

    let activeSiteContent = JSON.parse(localStorage.getItem('kumru_site_content'));
    if (!activeSiteContent) {
        activeSiteContent = defaultSiteContent;
        localStorage.setItem('kumru_site_content', JSON.stringify(activeSiteContent));
    }

    // Real-time Sync with Firebase Database
    if (hasConfig && dbRef) {
        onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                activeSiteContent = val;
                localStorage.setItem('kumru_site_content', JSON.stringify(activeSiteContent));
                setLanguage(currentLang);
            }
        }, (error) => {
            console.error("Firebase database read failed:", error);
        });
    }

    // ==========================================
    // 1. DİL YERELLEŞTİRME VERİ TABANI (TR/EN)
    // ==========================================
    const translations = {
        tr: {
            // Navbar
            "nav-home": "Ana Sayfa",
            "nav-customizer": "Soba Tasarla",
            "nav-calculator": "Isı Hesaplayıcı",
            "nav-products": "Ürünlerimiz",
            "nav-story": "Hikayemiz",
            "nav-gallery": "Galeri",
            "nav-contact": "İletişim",
            "nav-admin": "Yönetici Paneli",
            
            // Hero
            "hero-badge": "1987'den Bugüne Ustalıkla",
            "hero-title": "Sıcak Yuvaların Geleneksel Sırrı: <span>Kumru Kuzineleri</span>",
            "hero-desc": "Ordu'nun Kumru ilçesinde, döküm demir ve dayanıklı emayeyi usta işçilikle birleştiriyoruz. Evinize hem kış sıcaklığı hem de fırın lezzeti getiriyoruz.",
            "hero-btn-custom": "Kendi Sobanı Tasarla",
            "hero-btn-catalog": "Kataloğu İncele",
            "stat-exp": "Yıllık Deneyim",
            "stat-craft": "Usta İşçilik",
            "stat-export": "Ülkeye Gönderim",
            
            // Features
            "feat-1-title": "El Emeği & Ustalık",
            "feat-1-desc": "1987'den beri babadan oğula geçen döküm ve sac şekillendirme tecrübesi.",
            "feat-2-title": "Isı Verimliliği",
            "feat-2-desc": "Akıllı iç duman kanalları ile maksimum ısı tasarrufu ve fırın performansı.",
            "feat-3-title": "Kişiye Özel Tasarım",
            "feat-3-desc": "İstediğiniz ölçü, renk ve kapak seçenekleriyle sobanızı üretiyoruz.",
            "feat-4-title": "Hızlı & Güvenli Nakliye",
            "feat-4-desc": "Tüm Türkiye'ye ve yurt dışına özel sandıklı paketlerle güvenli gönderim.",
            
            // Customizer
            "cust-title": "Kendi Sobanı Tasarla",
            "cust-subtitle": "Yaşam alanınıza en uygun modeli seçin, emaye rengini belirleyin ve aksesuarlarını ekleyip teklif alın.",
            "cust-group-type": "1. Soba Modeli Seçin",
            "cust-type-somine": "Altın Süslü Kuzine",
            "cust-type-klasik": "Klasik Kuzine",
            "cust-type-kovali": "Fanlı Soba",
            "cust-group-color": "2. Emaye Renk Seçeneği",
            "cust-color-siyah": "Mat Siyah",
            "cust-color-kirmizi": "Antik Kırmızı",
            "cust-color-kahve": "Kestane Kahve",
            "cust-group-acc": "3. Ek Aksesuar ve Yedek Parçalar",
            "cust-acc-pipe": "Lüks Boru Seti (+3 Boru, 1 Dirsek, Duvar Sacı)",
            "cust-acc-plate": "Zemin Koruma Tablası (Emaye)",
            "cust-acc-grid": "Yedek Ağır Döküm Izgara",
            "cust-acc-tray": "Emaye Fırın Tepsisi",
            "cust-price-lbl": "Tahmini Yaklaşık Fiyat",
            "cust-btn-whatsapp": "WhatsApp ile Tasarımı Sipariş Et",
            "cust-btn-phone": "Doğrudan Telefon ile Teklif Al",
            
            // Calculator
            "calc-title": "Kuzine Isı Hesaplayıcı",
            "calc-subtitle": "Odanızın boyutuna ve yalıtım durumuna göre en verimli soba modelini ve boru ihtiyacını bulun.",
            "calc-lbl-size": "Oda Genişliği (Metrekare):",
            "calc-lbl-ins": "Bina Isı Yalıtım Durumu:",
            "calc-ins-good": "İyi Yalıtım",
            "calc-ins-mid": "Standart / Orta",
            "calc-ins-bad": "Zayıf / Yalıtımsız",
            "calc-btn": "Hesaplamayı Yap",
            "calc-placeholder": "Değerleri girip hesapla butonuna bastığınızda en uygun kuzine modeli burada listelenecektir.",
            "calc-res-title": "Isınma İhtiyacı Analiz Raporu",
            "calc-res-output": "Gerekli Isı Gücü",
            "calc-res-pipe": "Önerilen Boru Boyu",
            "calc-res-recom": "Tavsiye Edilen Kuzine Modelimiz",
            "calc-res-desc": "Seçilen oda hacmi için ideal yanma ve pişirme performansı sunar.",
            
            // Products
            "prod-title": "Soba Kataloğumuz",
            "prod-subtitle": "Kumru'daki imalathanemizde titizlikle ürettiğimiz en popüler modellerimiz.",
            "prod-badge-new": "En Çok Satan",
            "prod-badge-classic": "Geleneksel",
            "prod-badge-eco": "Ekonomik",
            "prod-spec-dim": "Ebatlar",
            "prod-spec-weight": "Ağırlık",
            "prod-spec-oven": "Fırın Ebatı",
            "prod-spec-cap": "Isıtma Hacmi",
            "prod-btn-inquire": "Fiyat Sor / Detay Al",
            "prod-badge-100local": "100% Yerli Üretim",
            "prod-title-kat-kaloriferi": "Kat Kaloriferi",
            "prod-desc-kat-kaloriferi": "Dijital kontrol paneli, otomatik sıcaklık ayarı ve çift daire ısıtma gücüne sahip %100 yerli üretim katı yakıtlı kat kaloriferi. Apartman ve müstakil evler için ideal merkezi ısıtma çözümü.",
            "prod-spec-control": "Kontrol",
            "prod-spec-control-val": "Dijital Panel / Otomatik",
            "prod-spec-power": "Isıtma Gücü",
            "prod-spec-power-val": "2 Daire Kapasiteli",
            
            // History
            "hist-title": "1987'den Bugüne Hikayemiz",
            "hist-subtitle": "Bir demirci atölyesinden tüm Türkiye'ye uzanan sıcaklık serüveni.",
            "hist-1-title": "Atölyenin Temeli",
            "hist-1-desc": "Ordu Kumru'da usta demirciler tarafından ilk el yapımı kuzine üretildi.",
            "hist-2-title": "Markalaşma ve Emaye Devrimi",
            "hist-2-desc": "Ürünlerin dayanıklılığını artırmak için yüksek ısı emaye kaplama teknolojisine geçildi.",
            "hist-3-title": "Şömine Serisi",
            "hist-3-desc": "Büyük camlı, şömine görünümlü modern döküm kuzineler ürün gamına eklendi.",
            "hist-4-title": "Geleceğe Sıcaklık",
            "hist-4-desc": "Online sipariş altyapısı ve yenilenen modern vizyonumuzla sıcacık yuvalar kurmaya devam ediyoruz.",
            
            // Gallery
            "gal-title": "Sizden Gelenler ve Atölye",
            "gal-subtitle": "Kumru Sobalarının evlerdeki sıcacık duruşu ve üretim aşamalarından kareler.",
            
            // Contact
            "cont-title": "Bizimle İletişime Geçin",
            "cont-subtitle": "Sorularınız, toptan sipariş talepleriniz veya detaylı bilgi için bize ulaşabilirsiniz.",
            "cont-address-title": "Adresimiz",
            "cont-address-desc": "Kadıncık, Şehit Neşe Küme Evleri No: 1, 52800 Kumru/Ordu",
            "cont-phone-title": "Telefon Hatlarımız",
            "cont-email-title": "E-Posta Adresimiz",
            "cont-social-title": "Sosyal Medyada Biz",
            
            // Footer
            "foot-desc": "Kumru Soba, 1987'den bu yana Ordu Kumru'da döküm ve sac kuzine soba imalatında kalitenin ve güvenin adresidir.",
            "foot-copy": "&copy; 2026 Kumru Soba. Tüm Hakları Saklıdır.",
            "foot-by": "DeepMind Antigravity Tarafından Gururla Tasarlandı.",
            "wa-bubble": "Merhaba! Nasıl yardımcı olabilirim?"
        },
        en: {
            // Navbar
            "nav-home": "Home",
            "nav-customizer": "Design Stove",
            "nav-calculator": "Heat Calculator",
            "nav-products": "Products",
            "nav-story": "Our Story",
            "nav-gallery": "Gallery",
            "nav-contact": "Contact",
            "nav-admin": "Admin Panel",
            
            // Hero
            "hero-badge": "Craftsmanship Since 1987",
            "hero-title": "Traditional Secret of Cozy Homes: <span>Kumru Stoves</span>",
            "hero-desc": "In Kumru, Ordu, we combine heavy cast iron and durable enamel with master craftsmanship. Bringing both winter warmth and bakery flavor to your home.",
            "hero-btn-custom": "Design Your Stove",
            "hero-btn-catalog": "View Catalog",
            "stat-exp": "Years Experience",
            "stat-craft": "Master Craftsmen",
            "stat-export": "Countries Exported",
            
            // Features
            "feat-1-title": "Handcrafted & Expertise",
            "feat-1-desc": "Decades of casting and metal shaping experience passed down generations since 1987.",
            "feat-2-title": "Thermal Efficiency",
            "feat-2-desc": "Maximum heat retention and baking performance with smart internal smoke channels.",
            "feat-3-title": "Custom Designs",
            "feat-3-desc": "We manufacture your stove with custom sizes, colors, and door options.",
            "feat-4-title": "Safe Global Shipping",
            "feat-4-desc": "Secure delivery all around the world in special reinforced wooden crates.",
            
            // Customizer
            "cust-title": "Design Your Own Stove",
            "cust-subtitle": "Choose the model best suited for your living space, pick your enamel color, add accessories and get a quote.",
            "cust-group-type": "1. Select Stove Model",
            "cust-type-somine": "Golden Kuzine",
            "cust-type-klasik": "Classic Kuzine",
            "cust-type-kovali": "Fanned Stove",
            "cust-group-color": "2. Pick Enamel Color",
            "cust-color-siyah": "Matte Black",
            "cust-color-kirmizi": "Antique Red",
            "cust-color-kahve": "Chestnut Brown",
            "cust-group-acc": "3. Accessories & Spare Parts",
            "cust-acc-pipe": "Luxury Pipe Set (+3 Pipes, 1 Elbow, Wall Shield)",
            "cust-acc-plate": "Floor Protection Sheet (Enamel)",
            "cust-acc-grid": "Spare Heavy Cast Iron Grate",
            "cust-acc-tray": "Enamel Oven Tray",
            "cust-price-lbl": "Estimated Price",
            "cust-btn-whatsapp": "Order Design via WhatsApp",
            "cust-btn-phone": "Get Quote Directly by Phone",
            
            // Calculator
            "calc-title": "Stove Heat Calculator",
            "calc-subtitle": "Find the most efficient stove model and stove pipe length based on room size and insulation.",
            "calc-lbl-size": "Room Size (Square Meters):",
            "calc-lbl-ins": "Building Heat Insulation:",
            "calc-ins-good": "Good Insulation",
            "calc-ins-mid": "Standard / Medium",
            "calc-ins-bad": "Poor / Uninsulated",
            "calc-btn": "Calculate Requirement",
            "calc-placeholder": "Enter parameters and click calculate, the best recommended stove model will appear here.",
            "calc-res-title": "Heating Analysis Report",
            "calc-res-output": "Required Heat Output",
            "calc-res-pipe": "Recommended Pipe Length",
            "calc-res-recom": "Our Recommended Stove",
            "calc-res-desc": "Offers ideal combustion and baking performance for the selected room volume.",
            
            // Products
            "prod-title": "Our Stove Catalog",
            "prod-subtitle": "Our most popular models carefully crafted in our workshop in Kumru, Ordu.",
            "prod-badge-new": "Best Seller",
            "prod-badge-classic": "Traditional",
            "prod-badge-eco": "Economical",
            "prod-spec-dim": "Dimensions",
            "prod-spec-weight": "Weight",
            "prod-spec-oven": "Oven Size",
            "prod-spec-cap": "Heating Capacity",
            "prod-btn-inquire": "Ask for Price / Details",
            "prod-badge-100local": "100% Domestic Production",
            "prod-title-kat-kaloriferi": "Floor Heating Boiler",
            "prod-desc-kat-kaloriferi": "100% domestic production solid fuel floor heating boiler with digital control panel, automatic temperature control, and dual-apartment heating power. Ideal central heating solution for apartments and detached houses.",
            "prod-spec-control": "Control",
            "prod-spec-control-val": "Digital Panel / Automatic",
            "prod-spec-power": "Heating Power",
            "prod-spec-power-val": "2-Apartment Capacity",
            
            // History
            "hist-title": "Our Story Since 1987",
            "hist-subtitle": "A warmth journey extending from a blacksmith workshop to the whole country.",
            "hist-1-title": "Foundation of the Shop",
            "hist-1-desc": "The first handmade kuzine was produced by master blacksmiths in Kumru, Ordu.",
            "hist-2-title": "Branding & Enamel Revolution",
            "hist-2-desc": "Adopted high-temperature enamel coating tech to double product longevity.",
            "hist-3-title": "Fireplace Series",
            "hist-3-desc": "Modern cast kuzines with large ceramic glass doors added to product lineup.",
            "hist-4-title": "Warmth Into Future",
            "hist-4-desc": "Continuing to build warm homes with online order options and a modern brand vision.",
            
            // Gallery
            "gal-title": "Gallery & Customer Homes",
            "gal-subtitle": "Cozy setups of Kumru Stoves in real homes and scenes from our manufacturing process.",
            
            // Contact
            "cont-title": "Get in Touch",
            "cont-subtitle": "Contact us for questions, wholesale orders, or detailed technical specifications.",
            "cont-address-title": "Address",
            "cont-address-desc": "Kadincik, Sehit Nese Kume Evleri No: 1, 52800 Kumru/Ordu, Turkey",
            "cont-phone-title": "Phone Lines",
            "cont-email-title": "Email Address",
            "cont-social-title": "Follow Us",
            
            // Footer
            "foot-desc": "Kumru Soba is the symbol of trust and quality in cast-iron and sheet-metal stoves in Kumru, Ordu since 1987.",
            "foot-copy": "&copy; 2026 Kumru Soba. All Rights Reserved.",
            "foot-by": "Proudly Designed by DeepMind Antigravity.",
            "wa-bubble": "Hello! How can I help you today?"
        }
    };

    let currentLang = localStorage.getItem('kumru_lang') || 'tr';

    // 1b. Dinamik Dil ve İçerik Senkronizasyonu (Sync Dynamic Content with Translations)
    function updateTranslationsFromContent() {
        // Hero TR
        translations.tr["hero-badge"] = activeSiteContent.hero.trBadge;
        translations.tr["hero-title"] = activeSiteContent.hero.trTitle;
        translations.tr["hero-desc"] = activeSiteContent.hero.trDesc;
        translations.tr["hero-btn-custom"] = activeSiteContent.hero.trBtnCustom;
        translations.tr["hero-btn-catalog"] = activeSiteContent.hero.trBtnCatalog;
        // Hero EN
        translations.en["hero-badge"] = activeSiteContent.hero.enBadge;
        translations.en["hero-title"] = activeSiteContent.hero.enTitle;
        translations.en["hero-desc"] = activeSiteContent.hero.enDesc;
        translations.en["hero-btn-custom"] = activeSiteContent.hero.enBtnCustom;
        translations.en["hero-btn-catalog"] = activeSiteContent.hero.enBtnCatalog;

        // Stats
        activeSiteContent.hero.stats.forEach(stat => {
            translations.tr[stat.id] = stat.trLbl;
            translations.en[stat.id] = stat.enLbl;
            
            // Render actual numbers on index.html
            const statEl = document.querySelector(`.stat-item:has([data-i18n="${stat.id}"]) .stat-number`);
            if (statEl) {
                statEl.textContent = stat.val;
            }
        });

        // Contact
        translations.tr["cont-address-desc"] = activeSiteContent.contact.trAddress;
        translations.en["cont-address-desc"] = activeSiteContent.contact.enAddress;
    }

    // 1c. Dinamik Render Motoru (Dynamic Render Engine)
    function renderProducts(lang) {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        activeSiteContent.products.forEach(prod => {
            const tagText = lang === 'tr' ? prod.trTag : prod.enTag;
            const titleText = lang === 'tr' ? prod.trTitle : prod.enTitle;
            const descText = lang === 'tr' ? prod.trDesc : prod.enDesc;
            const inquireText = lang === 'tr' ? 'Fiyat Sor / Detay Al' : 'Ask for Price / Details';
            
            let specsHTML = '';
            prod.specs.forEach(spec => {
                const labelText = lang === 'tr' ? spec.trLabel : spec.enLabel;
                specsHTML += `
                    <div class="spec-line">
                        <i class="fa-solid ${spec.icon}"></i> 
                        <span>${labelText}</span>: <strong>${spec.val}</strong>
                    </div>`;
            });
            
            const imgSrc = prod.image.startsWith('/') || prod.image.startsWith('http') ? prod.image : '/' + prod.image;
            
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <span class="product-tag" style="background-color: var(--primary);">${tagText}</span>
                <div class="product-img-wrap">
                    <img src="${imgSrc}" alt="${titleText}">
                </div>
                <div class="product-body">
                    <h3 class="product-title">${titleText}</h3>
                    <p class="product-desc">${descText}</p>
                    
                    <div class="product-specs">
                        ${specsHTML}
                    </div>
                    
                    <div class="product-footer">
                        <div class="product-price">${prod.price.toLocaleString('tr-TR')}<span> TL</span></div>
                        <a target="_blank" href="https://wa.me/${activeSiteContent.contact.phoneRaw}?text=${encodeURIComponent(titleText + (lang === 'tr' ? ' hakkında bilgi almak istiyorum.' : ' I would like to get information about.'))}" class="btn btn-secondary" style="padding: 10px 18px;">${inquireText}</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function renderTimeline(lang) {
        const container = document.querySelector('.timeline');
        if (!container) return;
        
        container.innerHTML = '';
        
        activeSiteContent.timeline.forEach((item, idx) => {
            const titleText = lang === 'tr' ? item.trTitle : item.enTitle;
            const descText = lang === 'tr' ? item.trDesc : item.enDesc;
            const isOdd = idx % 2 === 0;
            const sideClass = isOdd ? 'timeline-item-odd' : 'timeline-item-even';
            
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${sideClass}`;
            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                    <div class="timeline-date">${item.year}</div>
                    <h4 class="timeline-title">${titleText}</h4>
                    <p class="timeline-desc">${descText}</p>
                </div>
            `;
            container.appendChild(timelineItem);
        });
    }

    function renderContactDetails(lang) {
        const addressDesc = document.querySelector('[data-i18n="cont-address-desc"]');
        if (addressDesc) {
            addressDesc.textContent = lang === 'tr' ? activeSiteContent.contact.trAddress : activeSiteContent.contact.enAddress;
        }
        
        const phoneCard = document.querySelector('.contact-card i.fa-phone-volume')?.closest('.contact-card');
        if (phoneCard) {
            const a = phoneCard.querySelector('a');
            if (a) {
                a.href = `tel:${activeSiteContent.contact.phoneRaw}`;
                a.textContent = activeSiteContent.contact.phone;
            }
        }
        
        const emailCard = document.querySelector('.contact-card i.fa-envelope-open-text')?.closest('.contact-card');
        if (emailCard) {
            const a = emailCard.querySelector('a');
            if (a) {
                a.href = `mailto:${activeSiteContent.contact.email}`;
                a.textContent = activeSiteContent.contact.email;
            }
        }
        
        const mapIframe = document.querySelector('.map-iframe');
        if (mapIframe) {
            mapIframe.src = activeSiteContent.contact.mapUrl;
        }
        
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks) {
            const fb = socialLinks.querySelector('[aria-label="Facebook"]');
            if (fb) fb.href = activeSiteContent.contact.facebook;
            const ig = socialLinks.querySelector('[aria-label="Instagram"]');
            if (ig) ig.href = activeSiteContent.contact.instagram;
            const wa = socialLinks.querySelector('[aria-label="WhatsApp"]');
            if (wa) wa.href = activeSiteContent.contact.whatsapp;
        }

        const waWidget = document.querySelector('.whatsapp-widget');
        if (waWidget) {
            const waBtn = waWidget.querySelector('.whatsapp-btn');
            if (waBtn) waBtn.href = activeSiteContent.contact.whatsapp;
        }
    }

    function renderCustomizerStoves(lang) {
        const optionGrid = document.querySelector('.customizer-options .option-grid');
        if (!optionGrid) return;
        
        optionGrid.innerHTML = '';
        
        // Exclude centralized boilers from customizer list
        const customizableStoves = activeSiteContent.products.filter(p => p.id !== 'kat-kaloriferi');
        
        customizableStoves.forEach((prod, idx) => {
            const titleText = lang === 'tr' ? prod.trTitle : prod.enTitle;
            const priceText = prod.price.toLocaleString('tr-TR') + ' TL';
            const isActive = selections.type === prod.id ? 'active' : '';
            
            let iconClass = 'fa-door-open';
            if (prod.id === 'klasik') iconClass = 'fa-cubes';
            if (prod.id === 'kovali') iconClass = 'fa-fan';
            
            const optCard = document.createElement('div');
            optCard.className = `opt-card ${isActive}`;
            optCard.setAttribute('data-type', prod.id);
            optCard.innerHTML = `
                <i class="fa-solid ${iconClass}"></i>
                <span class="opt-name">${titleText}</span>
                <span class="opt-price">${priceText}</span>
            `;
            
            optCard.addEventListener('click', (e) => {
                document.querySelectorAll('.opt-card[data-type]').forEach(c => c.classList.remove('active'));
                optCard.classList.add('active');
                selections.type = prod.id;
                updateCustomizerPrice();
            });
            
            optionGrid.appendChild(optCard);
        });
    }

    function updateConfigStoves() {
        activeSiteContent.products.forEach(prod => {
            if (config && config.types && config.types[prod.id]) {
                config.types[prod.id].price = prod.price;
                config.types[prod.id].trName = prod.trTitle;
                config.types[prod.id].enName = prod.enTitle;
                config.types[prod.id].image = prod.image;
            } else if (config && config.types && prod.id !== 'kat-kaloriferi') {
                config.types[prod.id] = {
                    trName: prod.trTitle,
                    enName: prod.enTitle,
                    price: prod.price,
                    image: prod.image
                };
            }
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('kumru_lang', lang);
        
        const langLabel = document.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = lang.toUpperCase();
        }

        // Apply content updates into translation layer
        updateTranslationsFromContent();

        // Render dynamic content lists
        renderProducts(lang);
        renderTimeline(lang);
        renderContactDetails(lang);
        updateConfigStoves();
        renderCustomizerStoves(lang);

        // Translate everything
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.documentElement.lang = lang;
        
        updateCustomizerPrice();
        if (document.querySelector('.result-content')?.classList.contains('active')) {
            calculateHeat();
        }
    }

    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });

        document.querySelectorAll('.lang-opt').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const selectedLang = e.currentTarget.getAttribute('data-lang');
                setLanguage(selectedLang);
            });
        });
    }

    // ==========================================
    // 2. SOBA ÖZELLEŞTİRİCİ MOTORU (Customizer)
    // ==========================================
    const config = {
        types: {
            somine: {
                trName: "Klasik Altın Süslü Kuzine Soba",
                enName: "Classic Golden Decorated Kuzine Stove",
                price: 18500,
                image: "/images/soba-somine.png"
            },
            klasik: {
                trName: "Klasik Fırınlı Kuzine Soba",
                enName: "Classic Baking Kuzine Stove",
                price: 12000,
                image: "/images/soba-klasik.png"
            },
            kovali: {
                trName: "Yüksek Verimli Fanlı Soba",
                enName: "High-Efficiency Fanned Stove",
                price: 21000,
                image: "/images/soba-kovali.png"
            }
        },
        colors: {
            siyah: { trName: "Mat Siyah", enName: "Matte Black", filter: "none", price: 0 },
            kirmizi: { trName: "Antik Kırmızı", enName: "Antique Red", filter: "sepia(0.7) hue-rotate(335deg) saturate(2.5) brightness(0.75)", price: 1500 },
            kahve: { trName: "Kestane Kahve", enName: "Chestnut Brown", filter: "sepia(0.65) hue-rotate(345deg) saturate(1.8) brightness(0.6)", price: 1200 }
        },
        accessories: {
            pipe: { trName: "Lüks Boru Seti", enName: "Luxury Pipe Set", price: 1200 },
            plate: { trName: "Alt Koruma Tablası", enName: "Bottom Protection Sheet", price: 800 },
            grid: { trName: "Yedek Ağır Izgara", enName: "Spare Heavy Grate", price: 600 },
            tray: { trName: "Ek Emaye Tepsi", enName: "Extra Oven Tray", price: 400 }
        }
    };

    let selections = {
        type: 'somine',
        color: 'siyah',
        accessories: []
    };

    const previewImg = document.querySelector('.stove-base-preview');
    const stoveGlow = document.querySelector('.customizer-stove-glow');
    const fireOverlay = document.querySelector('.stove-fire-overlay');
    const priceVal = document.querySelector('.price-val');

    function updateCustomizerPrice() {
        if (!priceVal) return;

        // Fiyat hesabı
        const basePrice = config.types[selections.type].price;
        const colorPrice = config.colors[selections.color].price;
        let accPrice = 0;
        selections.accessories.forEach(accKey => {
            accPrice += config.accessories[accKey].price;
        });

        const totalPrice = basePrice + colorPrice + accPrice;
        
        // Fiyatı formatlayarak yazdır
        priceVal.textContent = totalPrice.toLocaleString('tr-TR') + " TL";

        // Görsel güncelleme
        if (previewImg) {
            const imgSrc = config.types[selections.type].image;
            previewImg.src = imgSrc.startsWith('/') || imgSrc.startsWith('http') ? imgSrc : '/' + imgSrc;
            // Filtre uygulayarak dinamik emaye rengini değiştir
            previewImg.style.filter = config.colors[selections.color].filter;
        }

        // Şömine modelinde köz ışığını yakalım
        if (selections.type === 'somine') {
            if (stoveGlow) stoveGlow.classList.add('fire-on');
            if (fireOverlay) fireOverlay.classList.add('active');
        } else {
            if (stoveGlow) stoveGlow.classList.remove('fire-on');
            if (fireOverlay) fireOverlay.classList.remove('active');
        }
    }



    // Renk seçimi click dinleyici
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            const dotEl = e.currentTarget;
            dotEl.classList.add('active');
            selections.color = dotEl.getAttribute('data-color');
            updateCustomizerPrice();
        });
    });

    // Aksesuar seçimi click dinleyici
    document.querySelectorAll('.acc-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const itemEl = e.currentTarget;
            const accKey = itemEl.getAttribute('data-acc');
            
            itemEl.classList.toggle('checked');
            
            if (itemEl.classList.contains('checked')) {
                if (!selections.accessories.includes(accKey)) {
                    selections.accessories.push(accKey);
                }
            } else {
                selections.accessories = selections.accessories.filter(acc => acc !== accKey);
            }
            updateCustomizerPrice();
        });
    });

    // WhatsApp Sipariş Butonu
    const waOrderBtn = document.getElementById('btn-wa-order');
    if (waOrderBtn) {
        waOrderBtn.addEventListener('click', () => {
            const selectedStove = config.types[selections.type];
            const selectedColor = config.colors[selections.color];
            
            const stoveName = currentLang === 'tr' ? selectedStove.trName : selectedStove.enName;
            const colorName = currentLang === 'tr' ? selectedColor.trName : selectedColor.enName;
            
            let accNames = [];
            selections.accessories.forEach(accKey => {
                const acc = config.accessories[accKey];
                accNames.push(currentLang === 'tr' ? acc.trName : acc.enName);
            });

            const accText = accNames.length > 0 ? accNames.join(', ') : (currentLang === 'tr' ? "Yok" : "None");
            const priceText = priceVal.textContent;

            // WhatsApp Mesaj Metni
            const msg = currentLang === 'tr' 
                ? `Merhaba, Kumru Soba web sitenizden özel bir soba tasarladım. Detaylar aşağıdaki gibidir:\n\n*Model:* ${stoveName}\n*Renk:* ${colorName}\n*Ek Aksesuarlar:* ${accText}\n*Tahmini Tutar:* ${priceText}\n\nBilgi almak ve siparişimi onaylamak istiyorum.`
                : `Hello, I designed a custom stove on your website. Details:\n\n*Stove Model:* ${stoveName}\n*Color:* ${colorName}\n*Accessories:* ${accText}\n*Estimated Price:* ${priceText}\n\nI would like to get information and confirm my order.`;

            const encodedMsg = encodeURIComponent(msg);
            // WhatsApp Link
            const waLink = `https://wa.me/905342457908?text=${encodedMsg}`;
            window.open(waLink, '_blank');
        });
    }


    // ==========================================
    // 3. ISI VE BORU HESAPLAMA MOTORU (Calculator)
    // ==========================================
    const calcInputSize = document.getElementById('calc-size');
    const calcSizeVal = document.getElementById('calc-size-val');
    
    if (calcInputSize && calcSizeVal) {
        calcInputSize.addEventListener('input', (e) => {
            calcSizeVal.textContent = e.target.value;
        });
    }

    // Yalıtım seçimi
    let selectedInsulation = 'orta';
    document.querySelectorAll('.radio-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
            const cardEl = e.currentTarget;
            cardEl.classList.add('active');
            selectedInsulation = cardEl.getAttribute('data-ins');
        });
    });

    const btnCalculate = document.getElementById('btn-calculate');
    const resultPlaceholder = document.querySelector('.result-placeholder');
    const resultContent = document.querySelector('.result-content');

    function calculateHeat() {
        const size = parseInt(calcInputSize.value);
        let factor = 0.08; // Standart
        if (selectedInsulation === 'iyi') factor = 0.06;
        if (selectedInsulation === 'zayif') factor = 0.11;

        // Isı ihtiyacı (kW)
        const heatNeeded = (size * factor).toFixed(1);

        // Boru İhtiyacı (m)
        let pipeLength = 3;
        if (size >= 35 && size <= 65) pipeLength = 4;
        if (size > 65) pipeLength = 5;

        // Model Seçimi
        let modelKey = 'klasik';
        if (heatNeeded < 7.5) {
            modelKey = 'klasik';
        } else if (heatNeeded >= 7.5 && heatNeeded <= 12.0) {
            modelKey = 'somine';
        } else {
            modelKey = 'kovali';
        }

        const recommendedStove = config.types[modelKey];
        const stoveTitle = currentLang === 'tr' ? recommendedStove.trName : recommendedStove.enName;

        // Sonuçları Ekrana Yazma
        document.getElementById('res-kw').textContent = `${heatNeeded} kW`;
        document.getElementById('res-pipe').textContent = `${pipeLength} Metre`;
        document.getElementById('res-model-title').textContent = stoveTitle;
        const recImg = recommendedStove.image;
        document.getElementById('res-model-img').src = recImg.startsWith('/') || recImg.startsWith('http') ? recImg : '/' + recImg;
        document.getElementById('res-model-img').style.filter = "none"; // Temiz renk

        // UI geçişi
        if (resultPlaceholder && resultContent) {
            resultPlaceholder.style.display = 'none';
            resultContent.classList.add('active');
        }
    }

    if (btnCalculate) {
        btnCalculate.addEventListener('click', calculateHeat);
    }


    // ==========================================
    // 4. GALERİ DİNAMİK LIGHTBOX
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems && lightbox && lightboxImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const img = e.currentTarget.querySelector('img');
                const title = e.currentTarget.querySelector('h5').innerText;
                const desc = e.currentTarget.querySelector('p').innerText;

                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = `<strong>${title}</strong><br>${desc}`;
                lightbox.classList.add('active');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }


    // ==========================================
    // 5. MOBİL MENÜ VE SÜRÜKLENME EFEKTLERİ
    // ==========================================
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sayfa kaydırıldığında header stil değişimi
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Aktif nav linkini güncelleme
        let currentSection = "";
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobil menü aç / kapa
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Menü simgesini değiştir
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Link tıklandığında menüyü kapat
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }


    // ==========================================
    // 6. SCROLL REVEAL EFEKTİ
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Sadece bir kez tetiklensin
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Başlangıç dilini ayarla (Tüm değişkenler ve fonksiyonlar tanımlandıktan sonra)
    setLanguage(currentLang);
});
