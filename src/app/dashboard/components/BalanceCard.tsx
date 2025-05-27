import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function BalanceCard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  const balance = user.balance
  const isNegative = balance < 0
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(balance)

  return (
    <div
      className={`rounded-2xl p-6 shadow-md border ${
        isNegative
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-green-50 border-green-200 text-green-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-wide font-semibold">
            Saldo Atual
          </h2>
          <p className="text-4xl font-bold mt-1">{formattedBalance}</p>
        </div>

        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl ${
            isNegative ? 'bg-red-100' : 'bg-green-100'
          }`}
        >
          {/* 
          Ícone opcional:
          {isNegative ? (
            <ArrowTrendingDownIcon className="w-6 h-6" />
          ) : (
            <ArrowTrendingUpIcon className="w-6 h-6" />
          )} 
          */}
          <span className="text-xl">
            {isNegative ? '↓' : '↑'}
          </span>
        </div>
      </div>

      {isNegative && (
        <p className="mt-4 text-sm bg-red-100/70 p-3 rounded-lg">
          Seu saldo está negativo. Deposite valores para regularizar.
        </p>
      )}
    </div>
  )
}
