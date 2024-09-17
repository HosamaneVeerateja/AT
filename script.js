const entryForm = document.getElementById('entry-form');  
const saveButton = document.getElementById('save-button');  
const entriesTable = document.getElementById('entries-table');  
const graphCanvas = document.getElementById('graph-canvas');  
  
// initialize graph  
const ctx = graphCanvas.getContext('2d');  
const chart = new Chart(ctx, {  
  type: 'line',  
  data: {  
   labels: [],  
   datasets: [{  
    label: 'Total Amount',  
    data: [],  
    backgroundColor: 'rgba(255, 99, 132, 0.2)',  
    borderColor: 'rgba(255, 99, 132, 1)',  
    borderWidth: 1  
   }]  
  },  
  options: {  
   scales: {  
    yAxes: [{  
      ticks: {  
       beginAtZero: true  
      }  
    }]  
   }  
  }  
});  
  
// handle form submission  
entryForm.addEventListener('submit', (e) => {  
  e.preventDefault();  
  const date = document.getElementById('date').value;  
  const amount = document.getElementById('amount').value;  
  const words = document.getElementById('words').value;  
  // send request to backend to create new entry  
  fetch('/entries', {  
   method: 'POST',  
   headers: { 'Content-Type': 'application/json' },  
   body: JSON.stringify({ date, amount, words })  
  })  
  .then((response) => response.json())  
  .then((data) => {  
   // update graph and table  
   chart.data.labels.push(date);  
   chart.data.datasets[0].data.push(amount);  
   chart.update();  
   const newRow = document.createElement('tr');  
   newRow.innerHTML = `  
    <td>${date}</td>  
    <td>${amount}</td>  
    <td>${words}</td>  
    <td><button class="edit-button">Edit</button></td>  
   `;  
   entriesTable.tBodies[0].appendChild(newRow);  
  });  
});  
  
// handle edit button click  
entriesTable.addEventListener('click', (e) => {  
    if (e.target.classList.contains('edit-button')) {  
     const entryId = e.target.parentNode.parentNode.dataset.entryId;  
     // send request to backend to retrieve entry for editing  
     fetch(`/entries/${entryId}`, {  
      method: 'GET'  
     })  
     .then((response) => response.json())  
     .then((data) => {  
      // populate form with entry data  
      document.getElementById('date').value = data.date;  
      document.getElementById('amount').value = data.amount;  
      document.getElementById('words').value = data.words;  
      // show save button  
      saveButton.style.display = 'block';  
     });  
    }  
  });  
    
  // handle save button click  
  saveButton.addEventListener('click', (e) => {  
    e.preventDefault();  
    const entryId = entriesTable.tBodies[0].rows[0].dataset.entryId;  
    const date = document.getElementById('date').value;  
    const amount = document.getElementById('amount').value;  
    const words = document.getElementById('words').value;  
    // send request to backend to update entry  
    fetch(`/entries/${entryId}`, {  
     method: 'PUT',  
     headers: { 'Content-Type': 'application/json' },  
     body: JSON.stringify({ date, amount, words })  
    })  
    .then((response) => response.json())  
    .then((data) => {  
     // update graph and table  
     chart.data.labels[entryId] = date;  
     chart.data.datasets[0].data[entryId] = amount;  
     chart.update();  
     const row = entriesTable.tBodies[0].rows[0];  
     row.cells[0].textContent = date;  
     row.cells[1].textContent = amount;  
     row.cells[2].textContent = words;  
     // hide save button  
     saveButton.style.display = 'none';  
    });  
  });
  