const themeLightBtn = document.getElementById("themeLightBtn");
const themeDarkBtn = document.getElementById("themeDarkBtn");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (theme === "dark") {
    themeDarkBtn.classList.add("theme-btn--active");
    themeLightBtn.classList.remove("theme-btn--active");
  } else {
    themeLightBtn.classList.add("theme-btn--active");
    themeDarkBtn.classList.remove("theme-btn--active");
  }
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeLightBtn.addEventListener("click", () => setTheme("light"));
themeDarkBtn.addEventListener("click", () => setTheme("dark"));
