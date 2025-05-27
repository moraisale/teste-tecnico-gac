import BalanceCard from "./components/BalanceCard";
import DepositForm from "./components/DepositForm";

// /src/app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div className="grid md:grid-cols-3 gap-6 p-6 bg-gray-100 h-screen ">
      <div className="space-y-6">
        <BalanceCard />
        <div className="space-y-4">
          <DepositForm />
          {/* <TransferForm /> */}
        </div>
      </div>

      <div className="md:col-span-2">
        {/* <TransactionList /> */}
      </div>
    </div>
  )
}