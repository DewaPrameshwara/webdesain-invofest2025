const navbar = document.querySelector('#navbar');
const style = ['backdrop-blur-md', 'bg-white/30', 'border-b', 'border-white/20'];

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    navbar.classList.add(...style); 
  } else {
    navbar.classList.remove(...style); 
  }
});
