const ctx = document.getElementById('myPieChart').getContext('2d');

    let pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Selesai', 'Belum'],
        datasets: [{
          data: [0, 100],
          backgroundColor: ['#22c55e', '#e5e7eb'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });

    const checkboxes = document.querySelectorAll('.check');
    const statusText = document.getElementById('statusText');
    const popup = document.querySelector('.popup')

    const messages = [
      "Belum mulai 😅",
      "Langkah awal yang baik 👍",
      "Semakin sehat nih 💪",
      "Kesehatan makin terjaga 🌿",
      "Hampir sempurna! 😍",
      "Anda sudah sehat 🌟"
    ];

    checkboxes.forEach(cb => {
      cb.addEventListener('change', updateChart);
    });

    function updateChart() {
      const checkedCount = document.querySelectorAll('.check:checked').length;
      const percentage = (checkedCount / checkboxes.length) * 100;

      pieChart.data.datasets[0].data = [percentage, 100 - percentage];
      pieChart.update();
      
      statusText.textContent = messages[checkedCount];
      pupupAnimation()
    }
    
    function pupupAnimation() {
      popup.classList.remove('hidden')
      setTimeout(() => {
        popup.classList.add('hidden')
      }, 500);
    }

    updateChart();