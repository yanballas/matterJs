const routingInit = () => {
  history.scrollRestoration = 'manual';

  let options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const section = entry.target;
        history.replaceState(null, null, `#${section.id}`);
      }
    });
  }, options);

  const pages = document.querySelectorAll(NAMESECTION);
  pages.forEach((i) => {
    observer.observe(i);
  });
}

export { routingInit }