const result = document.getElementById("result");

const genderFemaleIMG = document.getElementById("female-img");

function calculatingBMI() {
  const bb = document.getElementById("beratBadan").value;
  const tb = document.getElementById("tinggiBadan").value;
  const tbM = tb / 100;

  const bmi = bb / (tbM * tbM);
  const category = clasification(bmi);
  result.innerHTML = `${bmi.toFixed(2)} ${category}`;
}

function updateGender() {
  const selected = document.querySelector('input[name="gender"]:checked').value;

  const genderMaleIMG = document.getElementById("male-img");
  const genderFemaleIMG = document.getElementById("female-img");

  if (selected == "male") {
    genderMaleIMG.setAttribute("src", "../../asets/gender-male-on.png");
    genderFemaleIMG.setAttribute("src", "../../asets/gender-female-off.png");
  } else if (selected == "female") {
    genderMaleIMG.setAttribute("src", "../../asets/gender-male-off.png");
    genderFemaleIMG.setAttribute("src", "../../asets/gender-female-on.png");
  }
}

function clasification(bmi) {
  if (bmi < 16.0) {
    return "(sangat kurus)";
  } else if (bmi < 16.99) {
    return "(kurus)";
  } else if (bmi < 18.49) {
    return "(agak kurus)";
  } else if (bmi < 24.99) {
    return "(normal)";
  } else if (bmi < 29.99) {
    return "(gemuk)";
  } else if (bmi < 16.99) {
    return "(kurus)";
  } else if (bmi < 34.99) {
    return "(obesitas kelas I)";
  } else if (bmi < 39.99) {
    return "(obesitas kelas II)";
  } else if (bmi >= 40.0) {
    return "(obesitas ekstrim)";
  } else {
    return "Hasil";
  }
}
