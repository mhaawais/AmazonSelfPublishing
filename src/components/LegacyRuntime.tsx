"use client";

import { useEffect } from "react";

type SlickCollection = {
  hasClass: (className: string) => boolean;
  length: number;
  slick: (options: Record<string, unknown> | string) => void;
};

type JQueryFactory = (selector: string) => SlickCollection;

export function LegacyRuntime() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".legacy-page");
    if (!page) return;

    page.querySelectorAll<HTMLImageElement>("img[data-imgurl]").forEach((image) => {
      const source = image.dataset.imgurl;
      if (source) image.src = source.startsWith("/") ? source : `/${source}`;
    });

    const jquery = (window as typeof window & { jQuery?: JQueryFactory }).jQuery;
    const sliders: Array<[string, number, Array<{ breakpoint: number; settings: { slidesToShow: number } }>]> = [
      [
        ".partnerslider",
        6,
        [
          { breakpoint: 1024, settings: { slidesToShow: 5 } },
          { breakpoint: 600, settings: { slidesToShow: 4 } },
          { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
      ],
      [
        ".ser_slider",
        4,
        [
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 600, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
      ],
      [
        ".portfolio_slide",
        4,
        [
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 600, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
      ],
      [
        ".slide-case-studies-list",
        3,
        [
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 600, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
      ],
      [
        ".banner-slide",
        1,
        [
          { breakpoint: 1024, settings: { slidesToShow: 1 } },
          { breakpoint: 600, settings: { slidesToShow: 1 } },
          { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
      ],
    ];

    if (jquery) {
      sliders.forEach(([selector, slidesToShow, responsive]) => {
        const slider = jquery(selector);
        if (slider.length && !slider.hasClass("slick-initialized")) {
          slider.slick({
            arrows: true,
            autoplay: true,
            autoplaySpeed: 2000,
            cssEase: "linear",
            dots: false,
            fade: false,
            infinite: true,
            lazyLoad: "progressive",
            nextArrow: jquery(".next"),
            prevArrow: jquery(".prev"),
            responsive,
            slidesToScroll: 1,
            slidesToShow,
            speed: 1000,
            vertical: false,
          });
        }
      });
    }

    const popup = page.querySelector<HTMLElement>("#popupOverlay");
    const popupTimer = window.setTimeout(() => popup?.classList.add("active"), 5000);

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const popupButton = target.closest(".popupBtn");
      const chatButton = target.closest(".liveChatt");
      const navButton = target.closest(".navbar-toggler");
      const navClose = target.closest(".navbar-close");
      const dropdownButton = target.closest("li.nav-item.dropdown .dropDown");
      const nav = page.querySelector<HTMLElement>("#navBarMenu");

      if (popupButton || chatButton) event.preventDefault();
      if (popupButton) popup?.classList.add("active");
      if (target.closest(".popup-close") || target === popup) popup?.classList.remove("active");
      if (navButton) nav?.classList.add("show");
      if (navClose) nav?.classList.remove("show");

      if (dropdownButton) {
        event.preventDefault();
        page.querySelector(".dropdown-menu")?.classList.toggle("show");
        dropdownButton.querySelector("i")?.classList.toggle("is-rotated");
      }
    };

    const handleInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.type !== "tel") return;
      const digits = input.value.replace(/\D/g, "").slice(0, 10);
      input.value =
        digits.length > 6
          ? digits.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3")
          : digits.length > 3
            ? digits.replace(/(\d{3})(\d{1,3})/, "$1-$2")
            : digits;
    };

    const handleSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const success = form.querySelector<HTMLElement>(".success");
      const error = form.querySelector<HTMLElement>(".error");
      error?.setAttribute("style", "display:none");
      if (success) {
        success.innerHTML = "<p class=\"mb-0 mt-0 pb-0\">Thank you for filling out your information!</p>";
        success.style.display = "block";
      }
      form.reset();
    };

    page.addEventListener("click", handleClick);
    page.addEventListener("input", handleInput);
    page.addEventListener("submit", handleSubmit as EventListener);

    return () => {
      window.clearTimeout(popupTimer);
      page.removeEventListener("click", handleClick);
      page.removeEventListener("input", handleInput);
      page.removeEventListener("submit", handleSubmit as EventListener);
      if (jquery) {
        sliders.forEach(([selector]) => {
          const slider = jquery(selector);
          if (slider.length && slider.hasClass("slick-initialized")) slider.slick("unslick");
        });
      }
    };
  }, []);

  return null;
}
