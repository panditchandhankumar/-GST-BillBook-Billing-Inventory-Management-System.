const transactions = [
  { date: "02 Apr 2026", type: "Sales Invoices", txnNo: "1", party: "Cash Sale", amount: "₹ 220" },
  { date: "01 Apr 2026", type: "Purchase", txnNo: "2", party: "Gupta Traders", amount: "₹ 8,200" },
  { date: "31 Mar 2026", type: "Sales Invoices", txnNo: "3", party: "Patel & Sons", amount: "₹ 24,800" },
  { date: "30 Mar 2026", type: "Payment Out", txnNo: "4", party: "Kumar Supplies", amount: "₹ 5,600" },
];

export function LatestTransactions() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left font-semibold text-muted-foreground px-4 py-2.5 uppercase text-xs">Date</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-2.5 uppercase text-xs">Type</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-2.5 uppercase text-xs">Txn No</th>
            <th className="text-left font-semibold text-muted-foreground px-4 py-2.5 uppercase text-xs">Party Name</th>
            <th className="text-right font-semibold text-muted-foreground px-4 py-2.5 uppercase text-xs">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-card-foreground">{tx.date}</td>
              <td className="px-4 py-3 text-card-foreground">{tx.type}</td>
              <td className="px-4 py-3 text-card-foreground">{tx.txnNo}</td>
              <td className="px-4 py-3 text-card-foreground">{tx.party}</td>
              <td className="px-4 py-3 text-card-foreground text-right font-medium">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
