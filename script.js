"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Scroll

const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);

btnScrollTo.addEventListener(`click`, (e) => {
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(`.nav__links`).addEventListener(`click`, (e) => {
  e.preventDefault();
  const clicked = e.target.classList.contains(`nav__link`);
  if (clicked) {
    const id = e.target.getAttribute(`href`);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed Component

const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabs = document.querySelectorAll(`.operations__tab`);
const content = document.querySelectorAll(`.operations__content`);

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  if (clicked) {
    // Remove active classes
    tabs.forEach((t) => t.classList.remove(`operations__tab--active`));
    content.forEach((c) => c.classList.remove(`operations__content--active`));

    // Active tab
    clicked.classList.add(`operations__tab--active`);

    //Active content area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add(`operations__content--active`);
  }
});
// menu fade animation
const nav = document.querySelector(`.nav`);

const fade = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing argument to handler function
nav.addEventListener(`mouseover`, fade.bind(0.5));
nav.addEventListener(`mouseout`, fade.bind(1));

// Sticky navigation

const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;
const observer = new IntersectionObserver(
  (entries) => {
    entries[0].isIntersecting
      ? nav.classList.remove(`sticky`)
      : nav.classList.add(`sticky`);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  }
);
observer.observe(header);

// revealing sections on scroll

const sectionObserver = new IntersectionObserver(
  (entry) => {
    const [ent] = entry;
    if (ent.isIntersecting) {
      ent.target.classList.remove(`section--hidden`);
      sectionObserver.unobserve(ent.target);
    }
  },
  {
    root: null,
    threshold: 0.15,
  }
);

const allSections = document.querySelectorAll(`.section`);
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});

/// lazy loading images

const imgTarget = document.querySelectorAll(`img[data-src]`);

const imgObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //// replace src with datasrc
        entry.target.src = `${entry.target.dataset.src}`;
        // remove bluf effect
        entry.target.addEventListener(`load`, () => {
          entry.target.classList.remove(`lazy-img`);
        });
        imgObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0,
    rootMargin: `200px`,
  }
);

imgTarget.forEach((img) => {
  imgObserver.observe(img);
});
//// slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();