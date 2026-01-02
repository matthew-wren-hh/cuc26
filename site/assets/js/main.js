const ready = () => {
  document.body.classList.add("is-ready");

  const initHeroSlider = (slider) => {
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    if (!slides.length) {
      return;
    }

    const statusItems = Array.from(slider.querySelectorAll("[data-hero-status]"));
    const prevButtons = Array.from(slider.querySelectorAll("[data-hero-prev]"));
    const nextButtons = Array.from(slider.querySelectorAll("[data-hero-next]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeIndex = 0;
    let timerId = null;

    const setActive = (newIndex) => {
      activeIndex = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      statusItems.forEach((status) => {
        status.textContent = `${activeIndex + 1} / ${slides.length}`;
      });
    };

    const stopTimer = () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    const startTimer = () => {
      if (prefersReducedMotion || timerId) {
        return;
      }
      timerId = window.setInterval(() => {
        setActive(activeIndex + 1);
      }, 7000);
    };

    setActive(activeIndex);
    startTimer();

    prevButtons.forEach((prevButton) => {
      prevButton.addEventListener("click", () => {
        stopTimer();
        setActive(activeIndex - 1);
        startTimer();
      });
    });

    nextButtons.forEach((nextButton) => {
      nextButton.addEventListener("click", () => {
        stopTimer();
        setActive(activeIndex + 1);
        startTimer();
      });
    });

    slider.addEventListener("mouseenter", stopTimer);
    slider.addEventListener("mouseleave", startTimer);
    slider.addEventListener("focusin", stopTimer);
    slider.addEventListener("focusout", startTimer);
  };

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const children = Array.from(group.children);
    children.forEach((child, index) => {
      child.style.setProperty("--delay", `${index * 90}ms`);
    });
  });

  document.querySelectorAll("[data-accordion]").forEach((item, index) => {
    const trigger = item.querySelector(".accordion__trigger");
    const panel = item.querySelector(".accordion__panel");
    if (!trigger || !panel) {
      return;
    }

    const panelId = panel.getAttribute("id") || `accordion-panel-${index + 1}`;
    panel.setAttribute("id", panelId);
    trigger.setAttribute("aria-controls", panelId);
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;
    });
  });

  document.querySelectorAll("[data-hero-slider]").forEach(initHeroSlider);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
