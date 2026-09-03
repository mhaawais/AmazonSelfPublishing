function initializeMobileNavigation() {
  var menu = document.querySelector("#navBarMenu");
  var toggle = document.querySelector(".navbar-toggler");
  var close = document.querySelector(".mobile-nav-close");
  var overlay = document.querySelector(".mobile-nav-overlay");

  if (!menu || !toggle || toggle.dataset.menuReady === "true") return;
  toggle.dataset.menuReady = "true";

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("show", open);
    document.body.classList.toggle("menu-open", open);
    if (overlay) {
      overlay.classList.toggle("active", open);
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleMenu(event) {
    event.preventDefault();
    if (event.type === "touchend") {
      toggleMenu.lastTouch = Date.now();
    } else if (Date.now() - (toggleMenu.lastTouch || 0) < 500) {
      return;
    }
    setMenu(!menu.classList.contains("show"));
  }
  toggle.addEventListener("click", toggleMenu);
  toggle.addEventListener("touchend", toggleMenu, { passive: false });
  if (close) close.addEventListener("click", function () { setMenu(false); });
  if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
  if (menu) menu.addEventListener("click", function (event) {
    var target = event.target.closest(".dropDown");
    if (target) {
      event.preventDefault();
      var dropdown = target.parentElement.querySelector(".dropdown-menu");
      var expanded = dropdown ? !dropdown.classList.contains("show") : false;
      if (dropdown) dropdown.classList.toggle("show", expanded);
      target.setAttribute("aria-expanded", expanded ? "true" : "false");
      var icon = target.querySelector("i");
      if (icon) icon.classList.toggle("is-rotated", expanded);
      return;
    }
    if (event.target.closest(".nav-link") && window.innerWidth < 992) setMenu(false);
  });
  if (menu) {
    var currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    menu.querySelectorAll("a.nav-link").forEach(function (link) {
      var linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
      var servicesPage = currentPath !== "/" && currentPath.indexOf("-services") !== -1;
      if (linkPath === currentPath || (servicesPage && linkPath === "/services")) link.classList.add("active");
    });
  }
  document.addEventListener("click", function (event) {
    if (menu && menu.classList.contains("show") && !event.target.closest(".header-wrapper")) setMenu(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 992) setMenu(false);
  });

  document.querySelectorAll("form[action='/api/contact']").forEach(function (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var button = form.querySelector("[type='submit']");
      var success = form.querySelector(".success");
      var error = form.querySelector(".error");
      if (button) button.disabled = true;
      if (error) error.style.display = "none";
      try {
        var response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });
        var data = await response.json();
        if (!response.ok) throw new Error(data.message || "Please check your information.");
        if (success) {
          success.innerHTML = "<p class=\"mb-0 mt-0 pb-0\">Thank you for filling out your information!</p>";
          success.style.display = "block";
        }
        form.reset();
      } catch (requestError) {
        if (error) {
          error.textContent = requestError.message || "Something went wrong. Please try again.";
          error.style.display = "block";
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMobileNavigation);
} else {
  initializeMobileNavigation();
}
