const API_BASE = 'https://script.google.com/macros/s/AKfycbx0oYca9Sp_ECczIxPK0UG7kl-5hSLYBToGmB_GhocWhQNRxOGK1M83wJUeu9LmGQ5GcA/exec';

const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const summary = document.getElementById('summary');

async function fetchTransactions() {
  const res = await fetch(`${API_BASE}?action=getTransactions`);
  const data = await res.json();

  renderTransactions(data);
  renderSummary(data);
}

function renderTransactions(data) {
  list.innerHTML = '';
  data.forEach(txn => {
    const li = document.createElement('li');
    li.className = 'border p-2 rounded shadow-sm bg-gray-50';
    li.textContent = `${txn.Date} • ${txn.Type} • ${txn.Amount} ${txn.Currency} • ${txn.Description}`;
    list.appendChild(li);
  });
}

function renderSummary(data) {
  const totals = {};

  data.forEach(txn => {
    const amt = parseFloat(txn.Amount) || 0;
    const cur = txn.Currency || 'AED';
    if (!totals[cur]) totals[cur] = { income: 0, expense: 0 };

    if (txn.Type === 'Income') totals[cur].income += amt;
    else if (txn.Type === 'Expense') totals[cur].expense += amt;
  });

  summary.innerHTML = '';

  Object.entries(totals).forEach(([currency, { income, expense }]) => {
    const balance = income - expense;
    const card = document.createElement('div');
    card.className = 'bg-white border rounded-lg shadow p-4';
    card.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">${currency}</h3>
      <p>Income: <span class="text-green-600 font-bold">${income.toFixed(2)}</span></p>
      <p>Expense: <span class="text-red-600 font-bold">${expense.toFixed(2)}</span></p>
      <p>Balance: <span class="font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}">${balance.toFixed(2)}</span></p>
    `;
    summary.appendChild(card);
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
