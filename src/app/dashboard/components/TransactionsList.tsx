import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth';
import { TransactionItem } from './TransactionItem';
import { ITransaction } from '@/types/transactions';

export const TransactionList = async () => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromUserId: session.user.id },
        { toUserId: session.user.id }
      ]
    },
    include: {
      fromUser: {
        select: { name: true, email: true }
      },
      toUser: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return (
    <div className="w-full max-w-full bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-lg text-[#002948] font-semibold mb-4">Histórico de Transações</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">Nenhuma transação encontrada</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((transaction: ITransaction) => (
            <TransactionItem 
              key={transaction.id}
              transaction={transaction}
              currentUserId={session.user.id}
              userName={session.user.name}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

