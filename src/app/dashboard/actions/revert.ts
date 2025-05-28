'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function revertTransaction(transactionId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Não autorizado')
  }

  return await prisma.$transaction(async (tx: any) => {
    // 1. Busca a transação original
    const originalTransaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: {
        fromUser: { select: { id: true } },
        toUser: { select: { id: true } }
      }
    })

    if (!originalTransaction) {
      throw new Error('Transação não encontrada')
    }

    // 2. Verifica se já foi estornada
    if (originalTransaction.reversed) {
      throw new Error('Esta transação já foi estornada')
    }

    // 3. Verifica permissão (usuário deve ser um dos envolvidos)
    const isInvolved = 
      originalTransaction.fromUserId === session.user.id || 
      originalTransaction.toUserId === session.user.id
    
    if (!isInvolved) {
      throw new Error('Você não tem permissão para estornar esta transação')
    }

    // 4. Atualiza saldos
    if (originalTransaction.type === 'TRANSFER') {
      // Reverte transferência: devolve ao remetente, tira do destinatário
      await tx.user.update({
        where: { id: originalTransaction.fromUserId! },
        data: { balance: { increment: originalTransaction.amount } },
      })

      await tx.user.update({
        where: { id: originalTransaction.toUserId! },
        data: { balance: { decrement: originalTransaction.amount } },
      })
    } else if (originalTransaction.type === 'DEPOSIT') {
      // Reverte depósito: subtrai do destinatário
      await tx.user.update({
        where: { id: originalTransaction.toUserId! },
        data: { balance: { decrement: originalTransaction.amount } },
      })
    }

    // 5. Marca transação como estornada e cria registro de reversão
    await tx.transaction.update({
      where: { id: transactionId },
      data: { reversed: true }
    })

    const reversalTransaction = await tx.transaction.create({
      data: {
        amount: originalTransaction.amount,
        type: 'REVERSAL',
        fromUserId: originalTransaction.toUserId,
        toUserId: originalTransaction.fromUserId,
        originalTransactionId: originalTransaction.id
      }
    })

    revalidatePath('/dashboard')
    return reversalTransaction
  })
}