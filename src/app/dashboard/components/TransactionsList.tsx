import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { RevertButton } from './RevertButton';



export default async function TransactionList() {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg text-[#002948] font-semibold mb-4">Histórico de Transações</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">Nenhuma transação encontrada</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id}
              transaction={transaction}
              currentUserId={session.user.id}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function TransactionItem({ transaction, currentUserId }: { 
  transaction: any,
  currentUserId: string
}) {
  const isTransfer = transaction.type === 'TRANSFER'
  const isDeposit = transaction.type === 'DEPOSIT'
  const isOutgoing = transaction.fromUserId === currentUserId

  const icon = isDeposit ? (
    <IoIosArrowRoundDown className="w-5 h-5" />
  ) : isTransfer ? (
    <FaArrowRightArrowLeft className="w-5 h-5" />
  ) : (
    <IoIosArrowRoundUp className="w-5 h-5" />
  )

  const iconBgClass = isDeposit
    ? 'bg-green-100 text-green-600'
    : isOutgoing
    ? 'bg-red-100 text-red-600'
    : 'bg-blue-100 text-blue-600'

  const title = isDeposit
    ? 'Depósito'
    : isOutgoing
    ? `Transferência para ${transaction.toUser?.name || 'Usuário'}`
    : `Transferência de ${transaction.fromUser?.name || 'Usuário'}`

  const amountPrefix = (isDeposit || !isOutgoing) ? '+' : '-'
  const amountColor = (isDeposit || !isOutgoing) ? 'text-green-600' : 'text-red-600'

  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(transaction.amount)

  const canRevert = 
  !transaction.reversed &&
  (transaction.toUserId === currentUserId || 
   transaction.fromUserId === currentUserId) &&
  transaction.type !== 'REVERSAL'

  return (
    <li className="flex items-start gap-4 p-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className={`p-2 rounded-full ${iconBgClass}`}>
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium text-[#002948]">{title}</p>
          <p className={`text-sm font-semibold ${amountColor}`}>
            {amountPrefix}{formattedAmount}
          </p>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            {new Date(transaction.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <div className="flex gap-2">
            {transaction.reversed && <span>(Estornada)</span>}
            {canRevert && (
              <RevertButton 
                transactionId={transaction.id} 
                disabled={transaction.reversed}
              />
            )}
          </div>
        </div>

        {!transaction.reversed && (isTransfer || isDeposit) && (
          <RevertButton transactionId={transaction.id} />
        )}
      </div>
    </li>
  )
}