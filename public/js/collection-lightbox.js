document.addEventListener('DOMContentLoaded', () => {
    const modalEl = document.getElementById('galleryLightbox');
    if (!modalEl) return;

    const thumbnails = Array.from(document.querySelectorAll('.gallery-img-btn'));
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxPrompt = document.getElementById('lightboxPrompt');
    const lightboxNumeral = document.getElementById('lightboxNumeral');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let currentIndex = 0;

    function showAt(index) {
        currentIndex = (index + thumbnails.length) % thumbnails.length;
        const thumb = thumbnails[currentIndex];
        const img = thumb.querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxPrompt.textContent = thumb.dataset.prompt;
        lightboxNumeral.textContent = thumb.dataset.numeral;
    }

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => showAt(index));
    });

    prevBtn.addEventListener('click', () => showAt(currentIndex - 1));
    nextBtn.addEventListener('click', () => showAt(currentIndex + 1));

    modalEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
        if (e.key === 'ArrowRight') showAt(currentIndex + 1);
    });
});
