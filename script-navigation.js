navigation.addEventListener("navigate", e => {
    let navigationId = e.destination.url.split("#")[1]?.trim();
    if (!navigationId) {
        return;
    }

    navigationId = `#${navigationId}`;

    const navigationLinkHtmlElements = document.querySelectorAll(".navigation__link");
    navigationLinkHtmlElements.forEach(navigationLinkHtmlElement => {
        navigationLinkHtmlElement.classList.remove("navigation__link--active");

        if (navigationLinkHtmlElement.getAttribute("href") === navigationId) {
            navigationLinkHtmlElement.classList.add("navigation__link--active");
        }
    })
});

// Configure changing of URL with scroll to sections
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      
      if (id) {
        history.replaceState(null, null, `#${id}`);
      }
    }
  });
}, {
  root: document.querySelector(".content"),
  rootMargin: "-20% 0px -60% 0px",
  threshold: 0
});

document.querySelectorAll("section").forEach((section) => observer.observe(section));
