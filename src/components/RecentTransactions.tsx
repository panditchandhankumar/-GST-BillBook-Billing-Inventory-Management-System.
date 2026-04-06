const transactions = [
  { id: 1, party: "Sharma Electronics", type: "Sale", amount: "₹12,500", status: "Paid", date: "Today" },
  { id: 2, party: "Gupta Traders", type: "Purchase", amount: "₹8,200", status: "Pending", date: "Today" },
  { id: 3, party: "Patel & Sons", type: "Sale", amount: "₹24,800", status: "Paid", date: "Yesterday" },
  { id: 4, party: "Kumar Supplies", type: "Purchase", amount: "₹5,600", status: "Due", date: "Yesterday" },
  { id: 5, party: "Singh Enterprises", type: "Sale", amount: "₹18,900", status: "Paid", date: "2 days ago" },
];

export function RecentTransactions() {
  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
          <div className="min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">{tx.party}</p>
            <p className="text-xs text-muted-foreground">{tx.type} · {tx.date}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <p className={`text-sm font-semibold ${tx.type === "Sale" ? "text-success" : "text-destructive"}`}>
              {tx.type === "Sale" ? "+" : "-"}{tx.amount}
            </p>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              tx.status === "Paid"
                ? "bg-success/10 text-success"
                : tx.status === "Pending"
                ? "bg-warning/10 text-warning"
                : "bg-destructive/10 text-destructive"
            }`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
