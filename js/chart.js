const ctx = document.getElementById('grafico-categorias');

fetch('../json/chart-data.json')
  .then(response => response.json())
  .then(data => {
    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const value = tooltipItem.raw;
                return `${tooltipItem.label}: ${value} clientes`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1000, 
            }
          }
        }
      }
    });
  })
  .catch(error => {
    console.error("Error al cargar el archivo JSON:", error);
  });
