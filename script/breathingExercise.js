let play = false;
let intervalId
let i= 0
const popup = document.querySelector('.popup')

function start() {
  const circle = document.querySelector('.circleBig')
  document.getElementById('textCapt').innerHTML = "Siap?"
  setTimeout(() => {
    if(!play) {
      circle.classList.toggle("animate-pulse")
      i = 0
      play = true
    } else {
      clearInterval(intervalId)
      circle.classList.remove("animate-pulse")
      play = false
      return false
    }
    
    if(play) {
      intervalId = setInterval(() => {
        i++
        timer(i)
        progres(i)
        caption(i)
        if(i >= 17) {
          clearInterval(intervalId)
          circle.classList.toggle("animate-pulse")
          timer(0)
          progres(0)
          caption(0)
          pupupAnimation()
          play = false
        }
      }, 1000);
    }
  }, 500);
}

function caption(sc) {
  const text = document.getElementById('textCapt')
  const caption = ['Mulai', 'Tarik nafas...', 'Tarik nafas...', 'Tarik nafas...', 'Tarik nafas...', 'Tahan...', 'Tahan...', 'Tahan...', 'Tahan...', 'Hembuskan...', 'Hembuskan...', 'Hembuskan...', 'Hembuskan...', 'Tahan...', 'Tahan...', 'Tahan...', 'Tahan...']
  text.innerHTML = caption[sc]
}

function timer(sc) {
  const text = document.getElementById('textTime')
  text.innerHTML = sc
}

function progres(sc) {
  const progresBar = document.getElementById("progresBar");

  let percentage = sc * 6.25;

  progresBar.style.width = `${percentage}%`;
}

function pupupAnimation() {
  popup.classList.remove('hidden')
  setTimeout(() => {
    popup.classList.add('hidden')
  }, 500);
}