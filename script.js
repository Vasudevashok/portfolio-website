/**
 * Vasudev A - Personal Portfolio Website Scripts
 * Features: Light/Dark theme toggle, Mobile navigation, Typing animation,
 *           IntersectionObserver scroll reveals, Skill bars loader, Project filters,
 *           and Contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Theme Switcher (Dark/Light Mode)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const iconMoon = document.getElementById('theme-icon-moon');
  const iconSun = document.getElementById('theme-icon-sun');
  const htmlElement = document.documentElement;

  // Retrieve theme preference from LocalStorage or default to system/dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      iconMoon.style.display = 'block';
      iconSun.style.display = 'none';
    } else {
      iconMoon.style.display = 'none';
      iconSun.style.display = 'block';
    }
  }

  // =========================================================================
  // 2. Mobile Menu (Hamburger Navigation)
  // =========================================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // =========================================================================
  // 3. Typing Animation (Hero Section)
  // =========================================================================
  const typedTextSpan = document.getElementById('typed-text');
  const textStrings = [
    "Final-Year Computer Science Student",
    "Aspiring Software Developer",
    "Full Stack Developer",
    "AWS Cloud Enthusiast",
    "Python & Flask Developer"
  ];
  
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const currentString = textStrings[stringIndex];
    
    if (isDeleting) {
      // Remove characters
      typedTextSpan.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // delete faster
    } else {
      // Add characters
      typedTextSpan.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80; // regular typing speed
    }

    // Checking states
    if (!isDeleting && charIndex === currentString.length) {
      // Fully typed: wait before deleting
      isDeleting = true;
      typingSpeed = 2000; // pause at end of string
    } else if (isDeleting && charIndex === 0) {
      // Fully deleted: switch to next string
      isDeleting = false;
      stringIndex = (stringIndex + 1) % textStrings.length;
      typingSpeed = 500; // pause before typing next
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Init typing
  if (typedTextSpan) {
    setTimeout(typeEffect, 1000);
  }

  // =========================================================================
  // 4. Scroll Revealing & Active Link Tracker
  // =========================================================================
  const reveals = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If skill section is shown, load skill progress bars
        if (entry.target.id === 'skills') {
          animateSkillBars();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(element => {
    revealObserver.observe(element);
  });

  // Track active menu items based on scroll position
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset navbar height
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 5. Skill Bars Animation
  // =========================================================================
  function animateSkillBars() {
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    progressBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
    });
  }

  // =========================================================================
  // 6. Projects Filtering
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // =========================================================================
  // 7. Contact Form Validation & Submission
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // Input elements
  const fields = {
    name: {
      input: document.getElementById('form-name'),
      error: document.getElementById('error-name')
    },
    email: {
      input: document.getElementById('form-email'),
      error: document.getElementById('error-email')
    },
    subject: {
      input: document.getElementById('form-subject'),
      error: document.getElementById('error-subject')
    },
    message: {
      input: document.getElementById('form-message'),
      error: document.getElementById('error-message')
    }
  };

  // Real-time validation helper
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    field.input.addEventListener('blur', () => validateField(key));
    field.input.addEventListener('input', () => {
      // Hide error message as soon as user types
      if (field.input.value.trim() !== '') {
        field.error.style.display = 'none';
        field.input.style.borderColor = '';
      }
    });
  });

  function validateField(key) {
    const field = fields[key];
    const value = field.input.value.trim();

    if (value === '') {
      field.error.style.display = 'block';
      field.input.style.borderColor = '#ef4444';
      return false;
    }

    if (key === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.error.textContent = "Please enter a valid email address";
        field.error.style.display = 'block';
        field.input.style.borderColor = '#ef4444';
        return false;
      }
    }

    field.error.style.display = 'none';
    field.input.style.borderColor = '';
    return true;
  }

  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    Object.keys(fields).forEach(key => {
      const isValid = validateField(key);
      if (!isValid) isFormValid = false;
    });

    if (isFormValid) {
      // Mock API trigger - simulating cloud service database save
      const formData = {
        name: fields.name.input.value,
        email: fields.email.input.value,
        subject: fields.subject.input.value,
        message: fields.message.input.value
      };

      console.log('Sending message:', formData);

      // Display success modal
      successModal.classList.add('show');
      
      // Clear form inputs
      contactForm.reset();
    }
  });

  // Modal dismiss handlers
  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('show');
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('show');
    }
  });

});
