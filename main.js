let clearSectionTabRequest = () => {};

const toTopButton = document.querySelector(".to-top");

if (toTopButton) {
  const toggleToTopButton = () => {
    toTopButton.classList.toggle("is-visible", window.scrollY > 120);
  };

  toggleToTopButton();
  window.addEventListener("scroll", toggleToTopButton, { passive: true });

  toTopButton.addEventListener("click", () => {
    clearSectionTabRequest();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

const sectionTabs = Array.from(document.querySelectorAll(".publication-tabs a[href^='#']"));

if (sectionTabs.length) {
  const tabSections = sectionTabs
    .map((tab) => {
      const section = document.querySelector(tab.getAttribute("href"));
      return section ? { tab, section } : null;
    })
    .filter(Boolean);

  const setActiveTab = (activeTab) => {
    sectionTabs.forEach((tab) => tab.removeAttribute("aria-current"));
    activeTab.setAttribute("aria-current", "page");
  };

  let requestedActiveItem = null;

  const updateActiveSectionTab = () => {
    const marker = window.scrollY + 170;
    let activeItem = tabSections[0];

    if (requestedActiveItem) {
      setActiveTab(requestedActiveItem.tab);
      return;
    }

    tabSections.forEach((item) => {
      if (item.section.offsetTop <= marker) {
        activeItem = item;
      }
    });

    if (activeItem) {
      setActiveTab(activeItem.tab);
    }
  };

  sectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      requestedActiveItem = tabSections.find((item) => item.tab === tab) || null;
      setActiveTab(tab);
    });
  });

  clearSectionTabRequest = () => {
    requestedActiveItem = null;
    updateActiveSectionTab();
  };

  const clearRequestedTabOnManualScroll = () => {
    if (!requestedActiveItem) {
      return;
    }

    requestedActiveItem = null;
    window.requestAnimationFrame(updateActiveSectionTab);
  };

  const scrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);

  updateActiveSectionTab();
  window.addEventListener("scroll", updateActiveSectionTab, { passive: true });
  window.addEventListener("resize", updateActiveSectionTab);
  window.addEventListener("wheel", clearRequestedTabOnManualScroll, { passive: true });
  window.addEventListener("touchmove", clearRequestedTabOnManualScroll, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (scrollKeys.has(event.key)) {
      clearRequestedTabOnManualScroll();
    }
  });
}

const modalButtons = document.querySelectorAll("[data-modal-target]");

modalButtons.forEach((button) => {
  const modal = document.getElementById(button.dataset.modalTarget);

  if (!modal) {
    return;
  }

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modal.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  };

  button.addEventListener("click", () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelectorAll("video").forEach((video) => {
      video.play().catch(() => {});
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach((closeButton) => {
    closeButton.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
});
