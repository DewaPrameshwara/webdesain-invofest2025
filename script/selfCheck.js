const ctx = document.getElementById('myPieChart').getContext('2d');

    let pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Selesai", "Belum"],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ["#22c55e", "#ababab"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
      },
    });

    const checkboxes = document.querySelectorAll('.check');
    const statusText = document.getElementById('statusText');
    const popup = document.querySelector('.popup')

    const messagesUp = ["Belum mulai 😅", "Langkah awal yang baik 👍", "Semakin sehat nih 💪", "Kesehatan makin terjaga 🌿", "Hampir sempurna! 😍", "Anda sudah sehat 🌟"];

    const messagesDown = ["Ayo mulai lagi 💪", "Jangan menyerah 🌱", "Masih bisa diperbaiki 😊", "Sedikit lagi semangat! 🔁", "Tetaplah termotivasi😅"];

    checkboxes.forEach((cb) => {
      cb.addEventListener("change", updateChart);
    });

    let lastCheckCount;
    let checkedCount;
    function updateChart() {
      checkedCount = document.querySelectorAll(".check:checked").length;
      const percentage = (checkedCount / checkboxes.length) * 100;

      pieChart.data.datasets[0].data = [percentage, 100 - percentage];
      pieChart.update();

      if (checkedCount >= lastCheckCount) {
        statusText.textContent = messagesUp[checkedCount];
      } else {
        statusText.textContent = messagesDown[checkedCount];
      }
      lastCheckCount = checkedCount;
      pupupAnimation();
    }
    
    function pupupAnimation() {
      popup.classList.remove('hidden')
      setTimeout(() => {
        popup.classList.add('hidden')
      }, 500);
    }

    updateChart();