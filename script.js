document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.querySelector('[aria-controls="mobile-menu"]');
  const mobileMenu = document.getElementById('mobile-menu');
  const userMenuButton = document.getElementById('user-menu-button');

  // Toggle mobile menu visibility
  menuToggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('active');
  });

  // Highlight the active link
  const links = document.querySelectorAll('.nav-links a, #mobile-menu a');
  links.forEach(link => {
      link.addEventListener('click', function() {
          links.forEach(l => l.classList.remove('bg-gray-900', 'text-white'));
          this.classList.add('bg-gray-900', 'text-white');
      });
  });
});
