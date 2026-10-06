/**
 * Saurish Perumalla Resume Website
 * Client-side Interactivity, Theming, and Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCopyButtons();
  initContactForm();
  initResumeModal();
  initScrollAnimations();
});

/* ==========================================================================
   Theme Toggle (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('sp-theme', 'light');
        showToast('Switched to light mode');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('sp-theme', 'dark');
        showToast('Switched to dark mode');
      }
    });
  }
}

/* ==========================================================================
   Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section indicator via Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
}

/* ==========================================================================
   Click to Copy Helper
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        showToast(`Copied to clipboard: ${textToCopy}`);
      } catch (err) {
        showToast(`Selected text: ${textToCopy}`);
      }
    });
  });
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusBox = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Website Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Set UI to loading state
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

    if (btnText) btnText.textContent = 'Sending message...';
    if (btnIcon) btnIcon.style.display = 'none';
    if (spinner) spinner.style.display = 'inline-block';
    if (submitBtn) submitBtn.disabled = true;

    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.className = 'form-status';
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/saurish.perumalla@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `New Resume Inquiry: ${subject} (from ${name})`,
          message: message,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || result.success === 'true' || result.success === true) {
        // Message sent successfully
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.className = 'form-status success';
          statusBox.innerHTML = `<strong>✓ Message sent directly to Saurish!</strong> Check your inbox for replies at ${email}.`;
        }
        showToast(`Message sent directly to saurish.perumalla@gmail.com!`, 4000);
        form.reset();

        if (btnText) btnText.textContent = 'Message Sent!';
        setTimeout(() => {
          if (btnText) btnText.textContent = 'Send Message';
          if (btnIcon) btnIcon.style.display = 'inline-block';
          if (spinner) spinner.style.display = 'none';
          if (submitBtn) submitBtn.disabled = false;
        }, 3500);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback triggered:', err);
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = 'form-status error';
        statusBox.innerHTML = `⚠️ Direct delivery encountered an issue. <a href="mailto:saurish.perumalla@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}" style="text-decoration: underline; font-weight: 700;">Click here to send directly via email client</a>.`;
      }
      showToast('Opening email client fallback...', 4000);

      const mailtoLink = `mailto:saurish.perumalla@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoLink;

      if (btnText) btnText.textContent = 'Send Message';
      if (btnIcon) btnIcon.style.display = 'inline-block';
      if (spinner) spinner.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   Resume Preview Modal & Print
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('view-resume-modal-btn');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      // Open modal first so print styles capture the clean document
      openModal();
      setTimeout(() => {
        window.print();
      }, 200);
    });
  }
}

/* ==========================================================================
   Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  const progressBars = document.querySelectorAll('.progress-fill');

  if ('IntersectionObserver' in window && progressBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';
          requestAnimationFrame(() => {
            setTimeout(() => {
              entry.target.style.width = width;
            }, 50);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => observer.observe(bar));
  }
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="#4c7ce5" stroke-width="2.5" fill="none">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}
