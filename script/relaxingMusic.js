const cardStyle = ['-translate-y-2', 'scale-105', 'shadow-xl', 'from-[#f07800]', 'to-[#ffb84d]']
const pauseSVG = "M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"
const playSVG = "M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM252.3 211.1C244.7 215.3 240 223.4 240 232L240 408C240 416.7 244.7 424.7 252.3 428.9C259.9 433.1 269.1 433 276.6 428.4L420.6 340.4C427.7 336 432.1 328.3 432.1 319.9C432.1 311.5 427.7 303.8 420.6 299.4L276.6 211.4C269.2 206.9 259.9 206.7 252.3 210.9z"
const musicContainerStyle = ['fixed', 'bottom-0', 'left-0', 'right-0', 'w-full', 'rounded-none']

const musicPlayer = document.getElementById('musicPlayer')
const musicTitle = document.getElementById('musicTitle')
const musicContainer = document.querySelector('.musicContainer')

window.addEventListener('scroll', ()=> {
  if(scrollY > 100) {
    musicContainer.classList.add(...musicContainerStyle)
  } else {
    musicContainer.classList.remove(...musicContainerStyle)
  }
})

let indexStart = 0
function startMusic(index) {
  const cards = document.querySelectorAll('.music')
  cards.forEach(card => {
    card.classList.remove(...cardStyle)
    
    const svg = card.querySelector('.svg')
    svg.setAttribute('d', playSVG )
  });
  if(indexStart != index) {
    const card = document.querySelector(`.music${index}`)
    const svg = card.querySelector('.svg')
    const url = card.getAttribute('data-name')
    const title = card.querySelector('div').innerHTML

    musicPlayer.setAttribute('src', url)
    musicTitle.innerHTML = title
    card.classList.add(...cardStyle)
    svg.setAttribute('d', pauseSVG )


    indexStart = index
  } else {
    indexStart = 0
    musicPlayer.setAttribute('src', '')
    musicTitle.innerHTML = 'Select your music!'
    return false
  }
}


{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg> */}