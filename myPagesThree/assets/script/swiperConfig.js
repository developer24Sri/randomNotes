const TOTAL_SLIDES = 8;        // make sure each swiper actually has 8 slides
const TRANSITION_MS = 800;

// Tab
const swiperTab = new Swiper(".TabSwiper", {
  slidesPerView: 1,
  loop: true,
  speed: TRANSITION_MS,
  allowTouchMove: false,
});

// Desktop
const swiperDesktop = new Swiper(".DesktopSwiper", {
  slidesPerView: 1,
  loop: true,
  speed: TRANSITION_MS,
  allowTouchMove: false,
});

// Mobile
const swiperMobile = new Swiper(".MobileSwiper", {
  slidesPerView: 1,
  loop: true,
  speed: TRANSITION_MS,
  allowTouchMove: false,
});

// Main Banner (master)
const swiperBanner = new Swiper(".bannerSwiper", {
  slidesPerView: 5,
  centeredSlides: true,
  loop: true,
  speed: TRANSITION_MS,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  allowTouchMove: false,
  simulateTouch: false,
});

// --- IMPORTANT: remove your old realIndexChange handler ---

// Smooth sync by stepping slaves in the same direction as the master.
// This avoids any jump-to-first/last at loop boundaries.
let prevReal = swiperBanner.realIndex;

swiperBanner.on("slideChangeTransitionStart", () => {
  const nextReal = swiperBanner.realIndex;

  // Compute forward/back step (mod TOTAL_SLIDES) to handle loop wrap (e.g., 7 -> 0)
  const forward = (nextReal - prevReal + TOTAL_SLIDES) % TOTAL_SLIDES;
  const direction = forward === 1 ? "next" : "prev"; // autoplay advances by exactly 1

  if (direction === "next") {
    swiperTab.slideNext(TRANSITION_MS);
    swiperDesktop.slideNext(TRANSITION_MS);
    swiperMobile.slideNext(TRANSITION_MS);
  } else {
    swiperTab.slidePrev(TRANSITION_MS);
    swiperDesktop.slidePrev(TRANSITION_MS);
    swiperMobile.slidePrev(TRANSITION_MS);
  }

  prevReal = nextReal;
});
