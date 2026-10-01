/**
 * MITTIKA NATURALS — Interactive UI Scripts
 * Lightweight, zero-dependency, accessible JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initProductGalleries();
  initFaqAccordions();
  initInciCopy();
  initContactInquiry();
  highlightActiveNav();
});

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --- Mobile Hamburger Navigation --- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta a');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* --- Interactive Product Gallery & Lightbox --- */
function initProductGalleries() {
  const galleries = document.querySelectorAll('[data-product-gallery]');

  galleries.forEach(gallery => {
    const mainImg = gallery.querySelector('.gallery-active-image');
    const thumbBtns = gallery.querySelectorAll('.gallery-thumb-btn');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!mainImg || !thumbBtns.length) return;

    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const newSrc = btn.getAttribute('data-img-src');
        const newAlt = btn.getAttribute('data-img-alt') || 'Mittika Naturals 4 Clay Face Mask';
        const newFull = btn.getAttribute('data-full-src') || newSrc;

        mainImg.style.opacity = '0.3';
        mainImg.style.transform = 'scale(0.98)';

        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.alt = newAlt;
          mainImg.setAttribute('data-full-src', newFull);
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
        }, 150);
      });
    });

    // Lightbox open
    if (lightboxModal && lightboxImg) {
      mainImg.addEventListener('click', () => {
        const fullSrc = mainImg.getAttribute('data-full-src') || mainImg.src;
        const altText = mainImg.alt;

        lightboxImg.src = fullSrc;
        lightboxImg.alt = altText;
        if (lightboxCaption) {
          lightboxCaption.textContent = altText;
        }

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
      }

      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  });
}

/* --- FAQ Accordion --- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all others for accordion behavior
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isCurrentlyActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --- Copy INCI Ingredients Button --- */
function initInciCopy() {
  const copyBtn = document.getElementById('copy-inci-btn');
  const inciTextEl = document.getElementById('inci-full-text');

  if (!copyBtn || !inciTextEl) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = inciTextEl.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied Ingredients!
      `;
      copyBtn.style.backgroundColor = 'var(--sage)';
      copyBtn.style.color = '#FFFFFF';

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.backgroundColor = '';
        copyBtn.style.color = '';
      }, 2500);
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
    });
  });
}

/* --- Contact Inquiry Frontend Dispatcher to WhatsApp --- */
function initContactInquiry() {
  const form = document.getElementById('quick-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('inquiry-name');
    const noteInput = document.getElementById('inquiry-message');
    const topicSelect = document.getElementById('inquiry-topic');

    const name = nameInput ? nameInput.value.trim() : '';
    const topic = topicSelect ? topicSelect.value : 'General Inquiry';
    const note = noteInput ? noteInput.value.trim() : '';

    let message = `Hello Mittika Naturals,\n`;
    if (name) message += `My name is ${name}.\n`;
    message += `Topic: ${topic}\n`;
    if (note) message += `Message: ${note}\n`;
    message += `I would love to know more about the 4 Clay Detox Face Mask Powder – 100 g.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/916239407139?text=${encoded}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/* --- Highlight Active Navigation Link --- */
function highlightActiveNav() {
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Normalizing relative vs root paths
    const cleanHref = href.replace(/^\.\.\//, '/').replace(/^\.\//, '/').replace(/index\.html$/, '');

    if (currentPath === '/' && (cleanHref === '/' || cleanHref === '')) {
      link.classList.add('active');
    } else if (cleanHref !== '/' && currentPath.includes(cleanHref.replace(/^\//, ''))) {
      link.classList.add('active');
    }
  });
}
