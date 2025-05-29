'use client'

import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io"
import { FaArrowRightArrowLeft } from "react-icons/fa6"
import { RevertButton } from './RevertButton'
import { ITransactionItem } from '@/types/transactions'

export const TransactionItem = ({ transaction, currentUserId, userName }: ITransactionItem) => {
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
    ? `Transferência para ${transaction.toUser?.name || userName}`
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
    <li className="flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition ">
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
            {canRevert && (isTransfer || isDeposit) && (
              <RevertButton 
                transactionId={transaction.id} 
                disabled={transaction.reversed}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
