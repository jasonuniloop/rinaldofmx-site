const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const galleryButtons = [...document.querySelectorAll(".gallery button")];
const galleryImages = galleryButtons.map((button) => button.querySelector("img")).filter(Boolean);
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = document.querySelector("[data-lightbox-img]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const reserveLink = document.querySelector("[data-reserve-link]");
const reserveCross = reserveLink?.querySelector(".reserve-cross");
const counters = [...document.querySelectorAll("[data-count-to]")];
let currentImageIndex = 0;

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (reserveLink && reserveCross) {
  document.addEventListener("mousemove", (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const box = reserveLink.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const moveX = Math.max(-9, Math.min(9, (event.clientX - centerX) / 22));
    const moveY = Math.max(-5, Math.min(5, (event.clientY - centerY) / 32));

    reserveCross.style.setProperty("--mx", `${moveX}px`);
    reserveCross.style.setProperty("--my", `${moveY}px`);
  });

  reserveLink.addEventListener("mouseleave", () => {
    reserveCross.style.setProperty("--mx", "0px");
    reserveCross.style.setProperty("--my", "0px");
  });
}

function showImage(index) {
  if (!lightbox || !lightboxImg || galleryImages.length === 0) return;

  currentImageIndex = (index + galleryImages.length) % galleryImages.length;
  const image = galleryImages[currentImageIndex];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => showImage(index));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => showImage(currentImageIndex - 1));
lightboxNext?.addEventListener("click", () => showImage(currentImageIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
  if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
});

function animateCounter(counter) {
  const target = Number(counter.dataset.countTo || 0);
  const duration = 1250;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}
