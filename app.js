// app.js
document.getElementById("addAccountBtn").addEventListener("click", () => {
  const name = prompt("Account name?");
  if (name) {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    accounts.push({ id: Date.now(), name, balance: 0 });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    renderAccounts();
  }
});

function renderAccounts() {
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const container = document.getElementById("accountList");
  container.innerHTML = "";
  accounts.forEach((acc) => {
    const div = document.createElement("div");
    div.className = "p-2 border rounded flex justify-between items-center";
    div.innerHTML = `<span>${acc.name}</span><span>$${acc.balance.toFixed(2)}</span>`;
    container.appendChild(div);
  });
}

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

window.onload = () => {
  renderAccounts();
};
