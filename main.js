const toTopButton = document.querySelector(".to-top");

if (toTopButton) {
  const toggleToTopButton = () => {
    toTopButton.classList.toggle("is-visible", window.scrollY > 120);
  };

  toggleToTopButton();
  window.addEventListener("scroll", toggleToTopButton, { passive: true });

  toTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
