// Add new account
document.getElementById("addAccountBtn").addEventListener("click", () => {
  const name = prompt("Enter account name:");
  if (name) {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    accounts.push({ id: Date.now(), name, balance: 0 });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    renderAccounts();
  }
});

// Render all accounts
function renderAccounts() {
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const container = document.getElementById("accountList");
  container.innerHTML = "";
  accounts.forEach(acc => {
    const div = document.createElement("div");
    div.className = "p-2 bg-darkaccent rounded flex justify-between items-center";
    div.innerHTML = `<span>${acc.name}</span><span>$${acc.balance.toFixed(2)}</span>`;
    container.appendChild(div);
  });
}

// Backup data
document.getElementById("backupBtn").addEventListener("click", () => {
  const data = {
    accounts: JSON.parse(localStorage.getItem("accounts") || "[]"),
    transactions: JSON.parse(localStorage.getItem("transactions") || "[]")
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `money-manager-backup-${Date.now()}.json`;
  a.click();
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`tab-${target}`).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('text-white'));
    btn.classList.add('text-white');
  });
});

// Init
window.onload = () => {
  renderAccounts();
};
