const icons = ["◎", "▰", "✚", "♥"];

async function loadContent() {
  const response = await fetch("content.json");
  const content = await response.json();

  document.querySelectorAll("[data-text]").forEach((element) => {
    const value = element.dataset.text.split(".").reduce((data, key) => data?.[key], content);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-link]").forEach((element) => {
    const url = content.links[element.dataset.link];
    if (url) element.href = url;
  });

  const features = document.querySelector("[data-list='features']");
  features.innerHTML = content.features.map((feature, index) => `
    <article class="feature-card" data-reveal>
      <div class="feature-icon" aria-hidden="true">${icons[index] ?? "•"}</div>
      <h3>${feature.title}</h3>
      <p>${feature.text}</p>
    </article>
  `).join("");

  const courses = document.querySelector("[data-list='courses']");
  if (courses && content.courses) {
    courses.innerHTML = content.courses.map((course) => `
      <article class="course-item" data-reveal>
        <span aria-hidden="true"></span>
        <p>${course}</p>
      </article>
    `).join("");
  }

  observeReveals();
}

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.16 });

  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}

function applyParallax() {
  document.querySelectorAll(".parallax").forEach((element) => {
    const speed = Number(element.dataset.speed || 0.12);
    const offset = Math.round(window.scrollY * speed);
    element.style.backgroundPositionY = `calc(50% + ${offset}px)`;
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
window.addEventListener("scroll", applyParallax, { passive: true });
window.addEventListener("resize", applyParallax);
loadContent().then(applyParallax);
