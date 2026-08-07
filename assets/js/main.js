const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const visitorLocation = document.getElementById('visitor-location');

async function loadVisitorLocation() {
  if (!visitorLocation) return;

  const providers = [
    {
      url: 'https://ipwho.is/',
      parse: (data) => {
        if (!data || data.success === false) return '';
        return [data.city, data.region, data.country].filter(Boolean).join(', ');
      },
    },
    {
      url: 'https://get.geojs.io/v1/ip/geo.json',
      parse: (data) => [data.city, data.region, data.country].filter(Boolean).join(', '),
    },
  ];

  for (const provider of providers) {
    try {
      const response = await fetch(provider.url, { cache: 'no-store' });
      if (!response.ok) continue;
      const location = provider.parse(await response.json());
      if (location) {
        visitorLocation.textContent = `Approximate location: ${location}`;
        return;
      }
    } catch (error) {
      // Try the next public geolocation provider.
    }
  }

  visitorLocation.textContent = 'Approximate location: unavailable';
}

loadVisitorLocation();
