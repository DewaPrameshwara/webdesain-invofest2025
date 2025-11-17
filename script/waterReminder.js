const historyPlace = document.querySelector('.history')
const totalWaterPlace = document.getElementById('todayWater')
const container = document.getElementById("editContainerContainer");

document.addEventListener("DOMContentLoaded", () => {
  let raw = localStorage.getItem("history");

  if (!raw || raw === "null" || raw.trim() === "") {
    localStorage.setItem("history", "[]");
    noData();
  } else {
    totalWater();
    getData();
  }
});

function saveHistory() {
  const input = document.getElementById("airMinum");
  const amount = parseInt(input.value);

  if (!amount || amount <= 0) return;

  if (amount >= reminderAmount) {
    nextReminder.setHours(nextReminder.getHours() + 1);
    updateReminderDisplay();
  }

  const now = new Date();
  const hour = String(now.getHours()).padStart("2", 0);
  const minute = String(now.getMinutes()).padStart("2", 0);

  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    water: amount,
    hour: hour,
    minute: minute,
  });

  localStorage.setItem("history", JSON.stringify(history));

  getData();
  totalWater();

  input.value = "";
}


function deleteHistory() {
  localStorage.removeItem("history");
  getData();
  totalWater();
}

function getData() {
  historyPlace.innerHTML = "";
  container.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("history")) || [];

  let i = -1;
  data.forEach((e) => {
    i++;
    template(e.water, e.hour, e.minute, i);
    addEditContainer(e.water, e.hour, e.minute, i);
  });
}

function totalWater() {
  let totalWater = 0;
  const data = JSON.parse(localStorage.getItem("history")) || [];

  data.forEach((e) => {
    totalWater += Number(e.water);
  });
  totalWaterPlace.innerHTML = totalWater;
}

function openSetting() {
  const settingContainer = document.getElementById("settingContainer");
  settingContainer.classList.toggle("hidden");
}

function deleteData(index) {
  const data = JSON.parse(localStorage.getItem("history")) || [];
  data.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(data));
  getData();
  totalWater();
}

function addEditContainer(water, hour, minute, index) {
  container.innerHTML += `<div class="editContainer mt-3 bg-gray-100 w-full flex justify-between p-5 rounded-2xl">
              <div class="box flex justify-start gap-x-5 items-center">
                <div class="flex items-center gap-x-1">
                  <svg class="w-[45px] h-[45px] fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 64C151.1 64 142.6 67.7 136.6 74.2C130.6 80.7 127.4 89.4 128.1 98.3L156.9 501.7C159.9 543.6 194.7 576 236.7 576L403.3 576C445.3 576 480.1 543.6 483.1 501.7L511.9 98.3C512.5 89.4 509.5 80.7 503.4 74.2C497.3 67.7 488.9 64 480 64L160 64zM211 361.5L194.4 128L445.6 128L429 361.5L416 368C395.9 378.1 372.1 378.1 352 368C331.9 357.9 308.1 357.9 288 368C267.9 378.1 244.1 378.1 224 368L211 361.5zM384 260C384 236 350.3 189.9 331.8 166.5C325.7 158.8 314.3 158.8 308.2 166.5C289.7 189.9 256 236 256 260C256 293.1 284.7 320 320 320C355.3 320 384 293.1 384 260z"/></svg>
                  <p class="font-semibold">${water} mL</p>
                </div>
                <h1>Pukul ${hour}.${minute}</h1>
              </div>
              <div class="buttons flex items-center gap-x-3">
                <button onclick="deleteData(${index})" class="justify-self-end cursor-pointer">
                  <svg  class="w-[45px] h-[45px] fill-red-600 hover:fill-orange-300 hover:scale-120 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 192C576 156.7 547.3 128 512 128L205.3 128C188.3 128 172 134.7 160 146.7L9.4 297.4C3.4 303.4 0 311.5 0 320C0 328.5 3.4 336.6 9.4 342.6L160 493.3C172 505.3 188.3 512 205.3 512L512 512C547.3 512 576 483.3 576 448L576 192zM284.1 252.1C293.5 242.7 308.7 242.7 318 252.1L351.9 286L385.8 252.1C395.2 242.7 410.4 242.7 419.7 252.1C429 261.5 429.1 276.7 419.7 286L385.8 319.9L419.7 353.8C429.1 363.2 429.1 378.4 419.7 387.7C410.3 397 395.1 397.1 385.8 387.7L351.9 353.8L318 387.7C308.6 397.1 293.4 397.1 284.1 387.7C274.8 378.3 274.7 363.1 284.1 353.8L318 319.9L284.1 286C274.7 276.6 274.7 261.4 284.1 252.1z"/></svg>
                </button>
              </div>
            </div>`;
}

function template(water, hour, minute, index) {
  historyPlace.innerHTML += `<div class="indexNumber-${index} mt-5 flex justify-between items-center">
      <div class="flex items-center gap-x-1">
        <svg class=" w-[30px] h-[30px] fill-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 64C151.1 64 142.6 67.7 136.6 74.2C130.6 80.7 127.4 89.4 128.1 98.3L156.9 501.7C159.9 543.6 194.7 576 236.7 576L403.3 576C445.3 576 480.1 543.6 483.1 501.7L511.9 98.3C512.5 89.4 509.5 80.7 503.4 74.2C497.3 67.7 488.9 64 480 64L160 64zM211 361.5L194.4 128L445.6 128L429 361.5L416 368C395.9 378.1 372.1 378.1 352 368C331.9 357.9 308.1 357.9 288 368C267.9 378.1 244.1 378.1 224 368L211 361.5zM384 260C384 236 350.3 189.9 331.8 166.5C325.7 158.8 314.3 158.8 308.2 166.5C289.7 189.9 256 236 256 260C256 293.1 284.7 320 320 320C355.3 320 384 293.1 384 260z"/></svg>
        <h1>Pukul ${hour}.${minute}</h1>
      </div>
      <p class="font-semibold">${water} mL</p>
  </div>`;
}

function noData() {
  historyPlace.innerHTML = `<h1 class="font-bold text-gray-600 my-5 text-2xl text-center m-auto">Mulai lah minum air hari ini</h1>`
}

let nextReminder = null; 
let reminderAmount = 200;

function getNextRoundedHour() {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  now.setMinutes(0);
  now.setSeconds(0);

  return now;
}


function initializeReminder() {
  nextReminder = getNextRoundedHour();
  updateReminderDisplay();
}

function updateReminderDisplay() {
  const hour = nextReminder.getHours().toString().padStart(2, "0");
  const minute = nextReminder.getMinutes().toString().padStart(2, "0");

  document.querySelector(".timer .left h1").textContent = `Pukul ${hour}.${minute}`;
}