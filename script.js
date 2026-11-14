// ==========================================
// 1. CONECTAR LAS 15 TARJETAS (FOTOS Y VIDEOS) + EFECTO 3D
// ==========================================
const photoCards = document.querySelectorAll('.photo-card');
const momentos = [];

photoCards.forEach((card, index) => {
    const imgEl = card.querySelector('img');
    const videoEl = card.querySelector('video');
    const isVideo = Boolean(videoEl);
    const src = isVideo ? videoEl.getAttribute('src') : imgEl.getAttribute('src');
    const titulo = card.querySelector('h3').textContent;
    const desc = card.getAttribute('data-desc') || "Un momento inolvidable a tu lado.";

    momentos.push({ src, titulo, desc, isVideo });

    // Efecto 3D al mover el cursor sobre la tarjeta
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    // Abrir Lightbox al hacer clic
    card.addEventListener('click', () => openLightbox(index));
});

// ==========================================
// 2. LIGHTBOX INTERACTIVO (FOTOS Y VIDEOS CON AUDIO)
// ==========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxNumber = document.getElementById('lightbox-number');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = "";
}

function updateLightboxContent() {
    const item = momentos[currentIndex];
    lightboxVideo.pause();

    if (item.isVideo) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = item.src;
        lightboxVideo.play();
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.src = "";
        lightboxImg.style.display = 'block';
        lightboxImg.src = item.src;
    }

    lightboxNumber.textContent = `Recuerdo #${currentIndex + 1} de ${momentos.length}`;
    lightboxTitle.textContent = item.titulo;
    lightboxDesc.textContent = item.desc;
}

document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);

document.getElementById('prev-btn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + momentos.length) % momentos.length;
    updateLightboxContent();
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % momentos.length;
    updateLightboxContent();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// ==========================================
// 3. EFECTO MÁQUINA DE ESCRIBIR EN LA CARTA
// ==========================================
const cartaTexto = "Dicen que los lirios simbolizan la pureza, la devoción y la belleza que nace del alma. Cuando pienso en ti, no puedo evitar ver esa misma magia en cada gesto tuyo. Gracias por llenar mi vida de calma, de risas y de momentos inolvidables. Hice este pequeño rincón digital para recordarte lo mucho que te amo y lo especial que eres para mí.";
const typewriterElement = document.getElementById('typewriter-text');
const signatureElement = document.getElementById('signature');
let charIndex = 0;
let typingStarted = false;

function typeWriter() {
    if (charIndex < cartaTexto.length) {
        typewriterElement.innerHTML += cartaTexto.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 35);
    } else {
        signatureElement.classList.add('visible');
    }
}

// ==========================================
// 4. SCROLL REVEAL (INTERSECTION OBSERVER)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.contains(typewriterElement) && !typingStarted) {
                typingStarted = true;
                typeWriter();
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ==========================================
// 5. MOTOR DE PÉTALOS DE LIRIO EN CANVAS
// ==========================================
const canvas = document.getElementById('lily-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let petals = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class LilyPetal {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1.1 + 0.4;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.swing = Math.random() * 1.5;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
        this.time = Math.random() * 100;
        const colors = ['rgba(255, 255, 255, 0.85)', 'rgba(255, 224, 235, 0.8)', 'rgba(248, 187, 208, 0.65)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.time += this.swingSpeed;
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.time) * 0.5;
        this.angle += this.spin;

        if (this.y > height + 30) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.3, this.size * 0.5, this.size * 0.6, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.5, this.size * 0.6, -this.size * 0.6, -this.size * 0.3, 0, -this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < 38; i++) {
    petals.push(new LilyPetal());
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });
    requestAnimationFrame(animateCanvas);
}

animateCanvas();