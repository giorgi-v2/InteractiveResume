let isNavClicking = false;
let scrollTimeout = null;

function updateActiveLink(targetHash) {
  const hash = targetHash || window.location.hash || "#home";
  document.querySelectorAll(".navigation__link").forEach((link) => {
    link.classList.toggle(
      "navigation__link--active",
      link.getAttribute("href") === hash,
    );
  });
}

document.querySelectorAll(".navigation__link").forEach((link) => {
  link.addEventListener("click", () => {
    isNavClicking = true;
    const hash = link.getAttribute("href");

    updateActiveLink(hash);

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isNavClicking = false;
    }, 800);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    if (isNavClicking) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        if (id) {
          history.replaceState(null, null, `#${id}`);
          updateActiveLink(`#${id}`);
        }
      }
    });
  },
  {
    root: document.querySelector(".content"),
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  },
);

document
  .querySelectorAll("section")
  .forEach((section) => observer.observe(section));

updateActiveLink();
