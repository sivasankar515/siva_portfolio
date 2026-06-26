// preload.js - Critical resource preloading
const criticalResources = [
  'style.css',
  'siva.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

function preloadCriticalResources() {
  criticalResources.forEach(resource => {
    if (resource.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = resource;
      link.onload = () => link.rel = 'stylesheet';
      document.head.appendChild(link);
    } else if (resource.endsWith('.jpg') || resource.endsWith('.png')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    }
  });
}

// Execute on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalResources);
} else {
  preloadCriticalResources();
}