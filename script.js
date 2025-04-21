// Replace with your sheet ID
const SHEET_ID = "1vnnOZZYSWdJ8nF8my3z_qXI1GBxwn2lZwtk4CdzaiGo";
const SHEET_RANGE = "entries";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_RANGE}`;

async function fetchData() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  const rows = json.table.rows;

  const data = rows.map(r => ({
    date: r.c[0]?.v || '',
    type: r.c[1]?.v || '',
    account: r.c[2]?.v || '',
    amount: parseFloat(r.c[3]?.v || 0),
    currency: r.c[4]?.v || '',
    category: r.c[5]?.v || '',
    notes: r.c[6]?.v || '',
  }));

  renderTotals(data);
  renderTable(data);
}

function renderTotals(data) {
  const totals = {};
  data.forEach(entry => {
    if (!totals[entry.currency]) totals[entry.currency] = 0;
    totals[entry.currency] += entry.amount;
  });

  const totalsDiv = document.getElementById("totals");
  totalsDiv.innerHTML = Object.entries(totals)
    .map(([currency, total]) => `
      <div class="bg-white p-4 rounded-xl shadow text-center">
        <h3 class="text-xl font-semibold">${currency}</h3>
        <p class="text-2xl font-bold mt-2">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
    `).join('');
}

function renderTable(data) {
  const table = document.getElementById("entries-table");
  table.innerHTML = `
    <thead class="bg-gray-50">
      <tr>
        ${["Date", "Type", "Account", "Amount", "Currency", "Category", "Notes"].map(th => `
          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">${th}</th>
        `).join('')}
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      ${data.map(entry => `
        <tr>
          <td class="px-4 py-2">${entry.date}</td>
          <td class="px-4 py-2">${entry.type}</td>
          <td class="px-4 py-2">${entry.account}</td>
          <td class="px-4 py-2">${entry.amount}</td>
          <td class="px-4 py-2">${entry.currency}</td>
          <td class="px-4 py-2">${entry.category}</td>
          <td class="px-4 py-2">${entry.notes}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

fetchData();
