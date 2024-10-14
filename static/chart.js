const ctx = document.getElementById('expense-chart').getContext('2d');
const expenseChart = new Chart(ctx, {
    type: 'bar', 
    data: {
        labels: [], 
        datasets: [{
            label: 'Expenses',
            data: [], 
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
