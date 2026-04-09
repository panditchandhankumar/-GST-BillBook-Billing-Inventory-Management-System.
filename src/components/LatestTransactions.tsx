import { useAppData } from "@/contexts/AppDataContext";

export function LatestTransactions() {
  const { invoices, expenses } = useAppData();

  // Combine invoices and expenses into a single transactions list, sorted by date desc
  const transactions = [
    ...invoices.map(inv => ({
      date: inv.date,
      type: "Sales Invoice",
      txnNo: inv.invoiceNo,
      party: inv.partyName,
      amount: inv.grandTotal,
    })),
    ...expenses.map(exp => ({
      date: exp.date,
      type: "Expense",
      txnNo: "-",
      party: exp.category,
      amount: -exp.amount,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const fmt = (n: number) => {
    const abs = Math.abs(n);
    const prefix = n < 0 ? "- ₹" : "₹";
    return `${prefix} ${abs.toLocaleString("en-IN")}`;
  };

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
          {transactions.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No transactions yet</td></tr>
          ) : (
            transactions.map((tx, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-card-foreground">
                  {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-card-foreground">{tx.type}</td>
                <td className="px-4 py-3 text-card-foreground">{tx.txnNo}</td>
                <td className="px-4 py-3 text-card-foreground">{tx.party}</td>
                <td className={`px-4 py-3 text-right font-medium ${tx.amount < 0 ? "text-destructive" : "text-card-foreground"}`}>
                  {fmt(tx.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
