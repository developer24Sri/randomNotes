const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

//Highlight active navlink:
const sections = document.querySelectorAll("section, footer"); 
const Links = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        Links.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { threshold: 0.5,
      rootMargin: "0px 0px -20% 0px"
   }

);


sections.forEach((section) => observer.observe(section));


//Materials:
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".materials-gallery");
  const items = Array.from(gallery.querySelectorAll(".materials-sub"));
  const toggle = document.querySelector(".materials-footer");
  const VISIBLE_COUNT = 4;

  if (!gallery || items.length === 0 || !toggle) return;

  // Make the footer keyboard-accessible if it's not a button
  toggle.tabIndex = toggle.tabIndex || 0;
  toggle.setAttribute("role", "button");
  toggle.style.cursor = "pointer";

  // compute heights based on current layout
  function computeHeights(visibleCount) {
    // ensure layout is up to date
    // visibleCount should be >=1
    const topRect = gallery.getBoundingClientRect();
    // clamp
    const vc = Math.min(Math.max(visibleCount, 1), items.length);

    // bottom coord of the last visible item (relative to viewport)
    const lastVisibleRect = items[vc - 1].getBoundingClientRect();
    const visibleHeight = Math.ceil(lastVisibleRect.bottom - topRect.top);

    // bottom coord of the very last item (all items)
    const lastRect = items[items.length - 1].getBoundingClientRect();
    const fullHeight = Math.ceil(lastRect.bottom - topRect.top);

    // In some edge cases where images or fonts are still loading, heights might be tiny.
    // We return at least 0.
    return {
      visibleHeight: Math.max(0, visibleHeight),
      fullHeight: Math.max(0, fullHeight),
    };
  }

  // apply collapsed state (only first VISIBLE_COUNT items visible)
  function applyCollapsed(animate = true) {
    const { visibleHeight } = computeHeights(VISIBLE_COUNT);
    // if animate is false, temporarily disable transition
    if (!animate) {
      const prev = gallery.style.transition;
      gallery.style.transition = "none";
      gallery.style.maxHeight = visibleHeight + "px";
      // force layout then restore transition
      requestAnimationFrame(() => {
        gallery.style.transition = prev || "max-height 420ms cubic-bezier(.22,.9,.32,1)";
      });
    } else {
      gallery.style.maxHeight = visibleHeight + "px";
    }
    gallery.classList.remove("expanded");
    toggle.textContent = "View More";
  }

  // apply expanded state (show all items)
  function applyExpanded() {
    const { fullHeight } = computeHeights(items.length);
    gallery.style.maxHeight = fullHeight + "px";
    gallery.classList.add("expanded");
    toggle.textContent = "View Less";
  }

  // Init: on full page load we measure after images/fonts are ready
  function init() {
    // If there are less or equal items than visible, don't show the toggle
    if (items.length <= VISIBLE_COUNT) {
      toggle.style.display = "none";
      // ensure gallery fits content
      gallery.style.maxHeight = ""; // let content define height
      return;
    }

    // Start collapsed
    applyCollapsed(false);
  }

  // toggle click / keyboard
  function toggleHandler() {
    if (gallery.classList.contains("expanded")) {
      applyCollapsed();
    } else {
      applyExpanded();
      // ensure we scroll to reveal area for small screens if user expects it
      // optional: uncomment next line to auto-scroll the gallery into view on expand
      // gallery.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  toggle.addEventListener("click", toggleHandler);
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleHandler();
    }
  });

  // Recompute sizes on resize + when images inside the gallery load
  let resizeTimer;
  window.addEventListener("resize", () => {
    // debounce resize
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (gallery.classList.contains("expanded")) {
        applyExpanded();
      } else {
        applyCollapsed();
      }
    }, 100);
  });

  // re-run sizes when any image loads (handles images that change row heights)
  const imgs = gallery.querySelectorAll("img");
  imgs.forEach(img => {
    if (!img.complete) {
      img.addEventListener("load", () => {
        // small delay to ensure layout settled
        setTimeout(() => {
          if (gallery.classList.contains("expanded")) applyExpanded();
          else applyCollapsed();
        }, 40);
      });
    }
  });

  // Run init on window load (images/fonts settled)
  window.addEventListener("load", init);
  // also call init after DOMContent if load might not fire (safety)
  setTimeout(() => {
    if (!gallery.style.maxHeight) init();
  }, 300);
});




// Why Choose Us:
const cards = document.querySelectorAll(".wcu-card");
const container = document.querySelector(".wcu-cards");
const elastic = { ease: "elastic.out(1, 0.75)", duration: 0.8 };

let isDisabled = window.innerWidth <= 576;
let lastIndex = -1;

// setup initial state
cards.forEach(card => {
  const rot = parseFloat(card.dataset.offsetRot) || 0;
  const initY = parseFloat(card.dataset.offsetY);
  card._initRot = rot;
  card._initY = isNaN(initY) ? 0 : initY;

  gsap.set(card, { 
    rotation: isDisabled ? 0 : rot, 
    yPercent: isDisabled ? 0 : card._initY,
    xPercent: 0,
    scale: 1
  });
});

// disable animation logic if <=576px
if (!isDisabled) {
  container.addEventListener("pointermove", e => {
    const rect = container.getBoundingClientRect();
    let percentage = (e.clientX - rect.left) / rect.width;
    percentage = Math.min(Math.max(percentage, 0), 1);

    let index = Math.floor(percentage * cards.length);
    index = Math.min(Math.max(index, 0), cards.length - 1);

    if (index === lastIndex) return;
    lastIndex = index;
    newPortion(index);
  });

  container.addEventListener("pointerleave", () => {
    lastIndex = -1;
    resetAll();
  });
}

function resetAll() {
  if (isDisabled) return; // do nothing for <=576px
  cards.forEach(card => {
    gsap.killTweensOf(card);
    gsap.to(card, {
      rotation: card._initRot,
      xPercent: 0,
      yPercent: card._initY,
      scale: 1,
      overwrite: true,
      ...elastic
    });
  });
}

function newPortion(i) {
  if (isDisabled) return; // do nothing for <=576px
  cards.forEach((card, idx) => {
    gsap.killTweensOf(card);

    if (idx === i) {
      gsap.to(card, {
        rotation: 0,
        xPercent: 0,
        scale: 1.1,
        overwrite: true,
        ...elastic
      });
    } else {
      const x = 50 / (idx - i);
      const customY = parseFloat(card.dataset.offsetY);
      const baseY = !isNaN(customY) ? customY : card._initY || 0;
      const deltaY = (idx - i) * 5;
      const y = baseY + deltaY;

      gsap.to(card, {
        xPercent: x,
        yPercent: y,
        scale: 1,
        overwrite: true,
        ...elastic
      });
    }
  });
}

// listen for resize so behavior updates dynamically
window.addEventListener("resize", () => {
  isDisabled = window.innerWidth <= 576;
  if (isDisabled) {
    // clear transforms & stop tweens
    cards.forEach(card => {
      gsap.killTweensOf(card);
      gsap.set(card, { rotation: 0, xPercent: 0, yPercent: 0, scale: 1 });
    });
  } else {
    resetAll();
  }
});

//stacked cards:
gsap.registerPlugin(ScrollTrigger);

const WCUcards = gsap.utils.toArray(".wcu-card");

WCUcards.forEach((card, index) => {
  card.style.zIndex = WCUcards.length - index; // ✅ fixed here

  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "top bottom-=100",
      end: "top top-=100",
      scrub: true,
      invalidateOnRefresh: true
    },
    ease: "none",
    scale: 1 - (WCUcards.length - index) * 0.025 // ✅ fixed here
  });

  ScrollTrigger.create({
    trigger: card,
    start: "top top+=40",
    pin: true,
    pinSpacing: false,
    id: "pin" + index,
    end: "max",
    invalidateOnRefresh: true,
  });
});
