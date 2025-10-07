const TRANSITION_MS = 800;

const swiperTab = new Swiper(".TabSwiper", {
  slidesPerView: 1,
  loop: true,
  speed: TRANSITION_MS,
  allowTouchMove: false,
});

const swiperDesktop = new Swiper(".DesktopSwiper", {
  slidesPerView: 1,
  loop: true,
  speed: TRANSITION_MS,
  allowTouchMove: false,
});

const swiperMobile = new Swiper(".MobileSwiper", {
  slidesPerView: 1,
  loop: true,
  speed: TRANSITION_MS,
  allowTouchMove: false,
});

const swiperBanner = new Swiper(".bannerSwiper", {
  slidesPerView: 5,
  loop: true,
  loopAdditionalSlides: 1, // ✅ fixes gaps
  speed: TRANSITION_MS,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  allowTouchMove: false,
  simulateTouch: false,
});

// ✅ derive real total slides dynamically
const TOTAL_SLIDES =
  swiperBanner.slides.length - swiperBanner.loopedSlides * 2;

let prevReal = swiperBanner.realIndex;

swiperBanner.on("slideChangeTransitionStart", () => {
  const nextReal = swiperBanner.realIndex;

  const forward = (nextReal - prevReal + TOTAL_SLIDES) % TOTAL_SLIDES;
  const direction = forward === 1 ? "next" : "prev";

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
