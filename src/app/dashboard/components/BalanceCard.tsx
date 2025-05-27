// src/app/dashboard/components/BalanceCard.tsx
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
    <div className={`p-6 rounded-xl shadow-sm ${
      isNegative 
        ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-800'
        : 'bg-gradient-to-br from-green-50 to-green-100 text-green-800'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium">Saldo Atual</h2>
          <p className="text-3xl font-bold mt-2">
            {formattedBalance}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${
          isNegative ? 'bg-red-100' : 'bg-green-100'
        }`}>
          {/* {isNegative ? (
            <ArrowTrendingDownIcon className="w-8 h-8" />
          ) : (
            <ArrowTrendingUpIcon className="w-8 h-8" />
          )} */}
        </div>
      </div>
      
      {isNegative && (
        <div className="mt-4 text-sm bg-red-50 p-2 rounded-md">
          Seu saldo está negativo. Deposite valores para regularizar.
        </div>
      )}
    </div>
  )
}