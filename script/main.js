const navbar = document.querySelector('#navbar');
const goUpBtn = document.querySelector(".goUp");
const navbarStyle = ["backdrop-blur-md", "bg-white/30", "border-b", "border-white/20"];

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    navbar.classList.add(...navbarStyle);
    goUpBtn.classList.remove("hidden");
  } else {
    navbar.classList.remove(...navbarStyle);
    goUpBtn.classList.add("hidden");
  }
});
