const images = [
    {
        src: "https://picsum.photos/seed/nature1/600/800",
        title: "Forest Morning",
        category: "nature"
    },
    {
        src: "https://picsum.photos/seed/nature2/600/800",
        title: "Mountain Lake",
        category: "nature"
    },
    {
        src: "https://picsum.photos/seed/nature3/600/800",
        title: "Autumn Leaves",
        category: "nature"
    },
    {
        src: "https://picsum.photos/seed/city1/600/800",
        title: "Night Street",
        category: "city"
    },
    {
        src: "https://picsum.photos/seed/city2/600/800",
        title: "City Silence",
        category: "city"
    },
    {
        src: "https://picsum.photos/seed/city3/600/800",
        title: "Metro Entrance",
        category: "city"
    },
    {
        src: "https://picsum.photos/seed/people1/600/800",
        title: "Portrait",
        category: "people"
    },
    {
        src: "https://picsum.photos/seed/people2/600/800",
        title: "Sunday Market",
        category: "people"
    },
    {
        src: "https://picsum.photos/seed/people3/600/800",
        title: "Street Moment",
        category: "people"
    },
    {
        src: "https://picsum.photos/seed/arch1/600/800",
        title: "Dome",
        category: "architecture"
    },
    {
        src: "https://picsum.photos/seed/arch2/600/800",
        title: "Glass Facade",
        category: "architecture"
    },
    {
        src: "https://picsum.photos/seed/arch3/600/800",
        title: "Old Staircase",
        category: "architecture"
    }
];

const galleryEl = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let currentIndex = 0;

function renderGallery() {
    galleryEl.innerHTML = "";

    images.forEach((img, index) => {
        const isVisible =
            currentFilter === "all" ||
            img.category === currentFilter;

        const card = document.createElement("div");

        card.className =
            "card appear" + (isVisible ? "" : " hidden");

        card.dataset.index = index;

        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Open ${img.title}`);

        card.innerHTML = `
            <img
                src="${img.src}"
                alt="${img.title}"
                loading="lazy"
            >

            <div class="card-overlay">
                <span class="card-title">
                    ${img.title}
                </span>
            </div>
        `;

        card.addEventListener("click", () => {
            openLightbox(index);
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(index);
            }
        });

        galleryEl.appendChild(card);
    });
}
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {

        filterButtons.forEach((button) => {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });

        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        currentFilter = btn.dataset.filter;

        renderGallery();
    });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCat = document.getElementById("lightboxCat");

const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");

function visibleIndices() {
    return images
        .map((img, index) => ({ img, index }))
        .filter(({ img }) =>
            currentFilter === "all" ||
            img.category === currentFilter
        )
        .map(({ index }) => index);
}
function openLightbox(index) {
    currentIndex = index;

    updateLightboxContent();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

function updateLightboxContent() {
    const data = images[currentIndex];

    lightboxImg.classList.remove("loaded");

    lightboxImg.src = data.src;
    lightboxImg.alt = data.title;

    lightboxImg.onload = () => {
        lightboxImg.classList.add("loaded");
    };

    lightboxImg.onerror = () => {
        lightboxImg.classList.add("loaded");
    };

    lightboxTitle.textContent = data.title;
    lightboxCat.textContent = data.category;
}

function showNext() {
    const visible = visibleIndices();

    if (visible.length === 0) return;

    const position = visible.indexOf(currentIndex);
    const nextPosition = (position + 1) % visible.length;

    currentIndex = visible[nextPosition];

    updateLightboxContent();
}

function showPrev() {
    const visible = visibleIndices();

    if (visible.length === 0) return;

    const position = visible.indexOf(currentIndex);
    const prevPosition =
        (position - 1 + visible.length) % visible.length;

    currentIndex = visible[prevPosition];

    updateLightboxContent();

    lightboxClose.addEventListener("click", closeLightbox);

    lightboxBackdrop.addEventListener("click", closeLightbox);

    lightboxNext.addEventListener("click", showNext);

    lightboxPrev.addEventListener("click", showPrev);

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("open")) return;

        if (e.key === "Escape") {
            closeLightbox();
        }

        if (e.key === "ArrowRight") {
            showNext();
        }

        if (e.key === "ArrowLeft") {
            showPrev();
        }
    });

    renderGallery();