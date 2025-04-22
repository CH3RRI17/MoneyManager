const API_BASE = 'https://script.google.com/macros/s/AKfycbx0oYca9Sp_ECczIxPK0UG7kl-5hSLYBToGmB_GhocWhQNRxOGK1M83wJUeu9LmGQ5GcA/exec';

const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');

async function fetchTransactions() {
  const res = await fetch(`${API_BASE}?action=getTransactions`);
  const data = await res.json();
  list.innerHTML = '';
  data.forEach(txn => {
    const li = document.createElement('li');
    li.textContent = `${txn.Date} • ${txn.Type} • ${txn.Amount} ${txn.Currency} • ${txn.Description}`;
    list.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  await fetch(`${API_BASE}?action=addTransaction`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
  form.reset();
  fetchTransactions();
});

fetchTransactions();
