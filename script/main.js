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

document.addEventListener("DOMContentLoaded", () => {
  const loginBtns = document.querySelectorAll(".nav-login-btn");
  const navAuthDesktop = document.getElementById("nav-auth-desktop");
  const navAuthMobile = document.getElementById("nav-auth-mobile");
  const avatarContainer = document.getElementById("avatar-initial");

  const navUserProfileDesktop = document.getElementById("nav-user-profile-desktop");
  const navUserProfileMobile = document.getElementById("nav-user-profile-mobile");
  const encodedSession = localStorage.getItem("heyhealth_session") || sessionStorage.getItem("heyhealth_session");
  //decode
  if (encodedSession) {
    try {
      const session = JSON.parse(atob(encodedSession));

      const avatarInitial = document.getElementById("avatar-initial-span");
      const dropdownUserName = document.getElementById("dropdown-user-name");
      const dropdownUserEmail = document.getElementById("dropdown-user-email");

      if (avatarInitial) avatarInitial.textContent = session.name.charAt(0).toUpperCase();
      if (dropdownUserName) dropdownUserName.textContent = session.name;
      if (dropdownUserEmail) dropdownUserEmail.textContent = session.email;
      loginBtns.forEach((btn) => {
        btn.classList.add("hidden");
      });

      const mobileUserName = document.getElementById("dropdown-user-name-mobile");
      const mobileUserEmail = document.getElementById("dropdown-user-email-mobile");

      if (mobileUserName) mobileUserName.textContent = session.name;
      if (mobileUserEmail) mobileUserEmail.textContent = session.email;

      if (navAuthDesktop) navAuthDesktop.classList.add("hidden");
      if (navAuthMobile) navAuthMobile.classList.add("hidden");

      if (navUserProfileDesktop) navUserProfileDesktop.classList.remove("hidden");
      if (navUserProfileMobile) navUserProfileMobile.classList.remove("hidden");
    } catch (e) {
      console.error("Gagal decode sesi:", e);
      showLoggedOutState(navAuthDesktop, navAuthMobile, navUserProfileDesktop, navUserProfileMobile);
    }
  } else {
    avatarContainer.classList.add("hidden");
    showLoggedOutState(navAuthDesktop, navAuthMobile, navUserProfileDesktop, navUserProfileMobile);
  }
});

function showLoggedOutState(navAuthDesktop, navAuthMobile, navUserProfileDesktop, navUserProfileMobile) {
  if (navAuthDesktop) navAuthDesktop.classList.remove("hidden");
  if (navAuthMobile) navAuthMobile.classList.remove("hidden");

  if (navUserProfileDesktop) navUserProfileDesktop.classList.add("hidden");
  if (navUserProfileMobile) navUserProfileMobile.classList.add("hidden");
}

//logout
function handleLogout() {
  localStorage.removeItem("heyhealth_session");
  sessionStorage.removeItem("heyhealth_session");

  window.location.reload();
}