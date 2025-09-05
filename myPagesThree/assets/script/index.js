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
// Materials:
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".materials-gallery");
  const items = Array.from(gallery.querySelectorAll(".materials-sub"));
  const toggle = document.querySelector(".materials-footer");

  if (!gallery || items.length === 0 || !toggle) return;

  toggle.tabIndex = toggle.tabIndex || 0;
  toggle.setAttribute("role", "button");
  toggle.style.cursor = "pointer";

  const getVisibleCount = () => {
    if (window.innerWidth <= 576) return 4; // mobile
    if (window.innerWidth <= 768) return 4; // tablet
    return 4; // desktop
  };

  let VISIBLE_COUNT = getVisibleCount();

  function computeHeights(visibleCount) {
    const topRect = gallery.getBoundingClientRect();

    const vc = Math.min(Math.max(visibleCount, 1), items.length);

    const lastVisibleRect = items[vc - 1].getBoundingClientRect();
    let visibleHeight = Math.ceil(lastVisibleRect.bottom - topRect.top);

    const lastRect = items[items.length - 1].getBoundingClientRect();
    let fullHeight = Math.ceil(lastRect.bottom - topRect.top);

    const BUFFER = 40; // tweak if needed
    return {
      visibleHeight: Math.max(0, visibleHeight + BUFFER),
      fullHeight: Math.max(0, fullHeight + BUFFER),
    };
  }

  function applyCollapsed(animate = true) {
    const { visibleHeight } = computeHeights(VISIBLE_COUNT);
    if (!animate) {
      const prev = gallery.style.transition;
      gallery.style.transition = "none";
      gallery.style.maxHeight = visibleHeight + "px";
      requestAnimationFrame(() => {
        gallery.style.transition =
          prev || "max-height 420ms cubic-bezier(.22,.9,.32,1)";
      });
    } else {
      gallery.style.maxHeight = visibleHeight + "px";
    }
    gallery.classList.remove("expanded");
    toggle.textContent = "View More";
  }

  function applyExpanded() {
    const { fullHeight } = computeHeights(items.length);
    gallery.style.maxHeight = fullHeight + "px";
    gallery.classList.add("expanded");
    toggle.textContent = "View Less";
  }

  function init() {
    if (items.length <= VISIBLE_COUNT) {
      toggle.style.display = "none";
      gallery.style.maxHeight = "";
      return;
    }

    // ✅ Start collapsed (show only limited books)
    applyCollapsed(false);
  }

  // Load
  window.addEventListener("load", () => {
    init();
  });

  // Resize handling
  window.addEventListener("resize", () => {
    VISIBLE_COUNT = getVisibleCount();
    if (!gallery.classList.contains("expanded")) {
      applyCollapsed(false);
    } else {
      applyExpanded();
    }
  });

  // Toggle click
  toggle.addEventListener("click", () => {
    if (gallery.classList.contains("expanded")) {
      // Scroll first
      const target = document.querySelector("#Materials");
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;

      const sectionTop = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: "smooth"
      });

      // Then collapse after short delay
      setTimeout(() => {
        applyCollapsed();
      }, 500);
    } else {
      applyExpanded();
    }
  });
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
