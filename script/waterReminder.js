const historyPlace = document.querySelector('.history')
const totalWaterPlace = document.getElementById('todayWater')

document.addEventListener('DOMContentLoaded', () => {
  totalWater()
  if(localStorage.getItem('history') == null) {
    noData()
  } else {
    getData()
  }
})


function clearHistory() {
  localStorage.removeItem('history')
  noData()
  totalWater()
  alert('History anda berhasil di hapus')
}

function saveHistory() {
  const value = document.getElementById('airMinum').value;
  if (value <= 0) return;

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    water: value,
    hour: hour,
    minute: minute
  });

  localStorage.setItem("history", JSON.stringify(history));

 getData()
 totalWater()
}

function getData() {
  historyPlace.innerHTML = ""
  const data = JSON.parse(localStorage.getItem('history')) || [];

  data.forEach(e => {
    template(e.water, e.hour, e.minute);
  });
}

function totalWater() {
  let totalWater = 0
  const data = JSON.parse(localStorage.getItem('history')) || []

  data.forEach(e => {
    totalWater += Number(e.water)
  });
  totalWaterPlace.innerHTML = totalWater
}

function template(water, hour, minute) {
  historyPlace.innerHTML += 
  `<div class="mt-5 flex justify-between items-center">
      <div class="flex items-center gap-x-1">
        <svg class=" w-[30px] h-[30px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 64C151.1 64 142.6 67.7 136.6 74.2C130.6 80.7 127.4 89.4 128.1 98.3L156.9 501.7C159.9 543.6 194.7 576 236.7 576L403.3 576C445.3 576 480.1 543.6 483.1 501.7L511.9 98.3C512.5 89.4 509.5 80.7 503.4 74.2C497.3 67.7 488.9 64 480 64L160 64zM211 361.5L194.4 128L445.6 128L429 361.5L416 368C395.9 378.1 372.1 378.1 352 368C331.9 357.9 308.1 357.9 288 368C267.9 378.1 244.1 378.1 224 368L211 361.5zM384 260C384 236 350.3 189.9 331.8 166.5C325.7 158.8 314.3 158.8 308.2 166.5C289.7 189.9 256 236 256 260C256 293.1 284.7 320 320 320C355.3 320 384 293.1 384 260z"/></svg>
        <h1>Pukul ${hour}.${minute}</h1>
      </div>
      <p class="font-semibold">${water} mL</p>
  </div>`
}

function noData() {
  historyPlace.innerHTML = `<h1 class="font-bold text-gray-600 my-5 text-2xl text-center m-auto">Mulai lah minum air hari ini</h1>`
}