document.addEventListener("DOMContentLoaded", function () {
  var menu = document.querySelector("#navBarMenu");
  var toggle = document.querySelector(".navbar-toggler");
  var close = document.querySelector(".navbar-close");

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("show", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggle) toggle.addEventListener("click", function (event) {
    event.preventDefault();
    setMenu(!menu.classList.contains("show"));
  });
  if (close) close.addEventListener("click", function () { setMenu(false); });
  if (menu) menu.addEventListener("click", function (event) {
    var target = event.target.closest(".dropDown");
    if (target) {
      event.preventDefault();
      var dropdown = target.parentElement.querySelector(".dropdown-menu");
      if (dropdown) dropdown.classList.toggle("show");
      target.querySelector("i")?.classList.toggle("is-rotated");
      return;
    }
    if (event.target.closest(".nav-link") && window.innerWidth < 768) setMenu(false);
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
});
