/**
 * Animacije pri skrolu, upravljanje korpom preko LocalStorage-a
 * i interaktivno rukovanje formama na stranici.
 */

// Pomocna funkcija koja čita stanje iz LocalStorage-a i refresuje broj stavki u navigaciji
function azurirajBrojacKorpe() {
    // Ako korpa ne postoji u memoriji, inicijalizuje se prazan niz
    const korpa = JSON.parse(localStorage.getItem('auraKorpa')) || [];
    const brojacElemenat = document.getElementById('cart-counter');
    if (brojacElemenat) {
        brojacElemenat.textContent = korpa.length;
    }
}

// Čekamo da se kompletan HTML DOM stablo učita pre nego što pokrenemo skripte
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ANIMACIJE PRI SKROLU (Intersection Observer)
    // ==========================================
    const animiraniElementi = document.querySelectorAll('.fade-in-element');

    // Element postaje vidljiv kada 15% njegove površine uđe u ekran
    const opcije = {
        root: null, // koristi se viewport kao referenca
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // blago pomeranje margina radi lepseg efekta
    };

    // Kreiranje observera koji dodaje CSS klasu 'prikazi' kada element uđe u vidno polje
    const posmatrac = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('prikazi');
                observer.unobserve(entry.target); // Prekinuti posmatranje nakon što se animacija izvrši jednom
            }
        });
    }, opcije);

    animiraniElementi.forEach(element => {
        posmatrac.observe(element);
    });

    azurirajBrojacKorpe();


    // ==========================================
    // 2. CENOVNIK, FORMA I KORPA (Services & Pricing)
    // ==========================================
    const pricingButtons = document.querySelectorAll('.pricing-action-btn');
    const planSelect = document.getElementById('selected-plan');
    const messageField = document.getElementById('user-message');
    const formSection = document.getElementById('pricing-form-section');

    // Provera da li se elementi cenovnika uopšte nalaze na trenutnoj stranici
    if (pricingButtons.length > 0) {
        
        pricingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Sprečavanje podrazumevanog ponašanja linka (#)

                // --- DEO 1: Automatsko selektovanje plana u formi i skrolovanje ---
                const izabraniPlan = button.getAttribute('data-plan');
                if (planSelect) {
                    planSelect.value = izabraniPlan; // Postavljanje vrednosti u <select> padajućem meniju
                }

                // Dinamicko generisanje predefinisane poruke ukoliko se izabere najskuplji paket
                if (izabraniPlan === 'Elite Brand' && messageField) {
                    messageField.value = "Hi Aura Team, I am interested in your Elite Brand plan. I would like to schedule a discovery call with your sales department to discuss our large-scale marketing needs.";
                } else if (messageField) {
                    messageField.value = "";
                }

                // Glatko skrolovanje ekrana do sekcije sa formom za poručivanje
                if (formSection) {
                    formSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // --- DEO 2: Logika korpe i LocalStorage čuvanja ---
                const kartica = button.closest('.pricing-card');
                // Izvlacenje cene iz kartice i čišćenje teksta (npr. uklanjanje "/mo")
                const cenaPlana = kartica.querySelector('.price').textContent.split('/')[0].trim();

                // Kreiranje objekta sa jedinstvenim ID-jem (pomoću vremenskog pečata)
                const stavka = {
                    id: Date.now(),
                    naziv: izabraniPlan,
                    cena: cenaPlana
                };

                // Čitanje trenutnog stanja, dodavanje nove stavke i ponovno upisivanje u LocalStorage
                let trenutnaKorpa = JSON.parse(localStorage.getItem('auraKorpa')) || [];
                trenutnaKorpa.push(stavka);
                localStorage.setItem('auraKorpa', JSON.stringify(trenutnaKorpa));

                azurirajBrojacKorpe();
                alert(`Uspešno ste dodali paket "${izabraniPlan}" u Vašu korpu!`);
            });
        });

        // Rukovanje slanjem forme za poručivanje paketa
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert(`Thank you for reaching out! You successfully requested the ${planSelect.value} package. Our team will contact you within 24 hours.`);
                orderForm.reset(); // Resetovanje svih polja forme nakon uspešnog slanja
            });
        }
    }

    // ==========================================
    // 3. LOGIKA ZA OPŠTU KONTAKT FORMU (Contact Page)
    // ==========================================
    const generalForm = document.getElementById('general-contact-form');
    if (generalForm) {
        generalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Izvlačenje vrednosti iz polja za ime radi personalizovane poruke
            const ime = document.getElementById('contact-name').value;
            
            alert(`Thank you, ${ime}! Your message has been sent successfully. We will get back to you as soon as possible.`);
            generalForm.reset(); // Resetovanje polja kontakt forme
        });
    }
});