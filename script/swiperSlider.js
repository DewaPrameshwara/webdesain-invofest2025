
  const swiper = new Swiper(".swiper", {
    loop: true,
    autoplay: {
      delay: 3000, // 3 detik per slide
      disableOnInteraction: false,
    },
    speed: 800, // kecepatan transisi (ms)
    effect: "slide", // bisa diganti ke 'fade', 'cube', dll
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });