import Sidebar from './components/Sidebar'
import BalanceCard from './components/BalanceCard'
import DepositForm from './components/DepositForm'
import TransactionList from './components/TransactionsList'
import TransferForm from './components/TransferForm'
import MobileMenu from './components/MobileMenu'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <MobileMenu />
      <div className="flex-1 p-4 md:py-6 md:px-6 w-full mx-auto ml-0 lg:ml-72 transition-all">
        <div className="grid gap-6 md:grid-cols-3">
          <section className="space-y-6 md:col-span-1">
            <BalanceCard />
            <div className="space-y-4">
              <DepositForm />
              <TransferForm />
            </div>
          </section>

          <section className="md:col-span-2">
            <TransactionList />
          </section>
        </div>
      </div>
    </main>
  )
}
