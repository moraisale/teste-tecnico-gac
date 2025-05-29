'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function transfer(toEmail: string, amount: number) {
  const session = await getServerSession(authOptions)
  
  // if (!session?.user?.id) {
  //   throw new Error('Não autorizado')
  // }

  // if (amount <= 0) {
  //   throw new Error('Valor da transferência deve ser positivo')
  // }

  // if (session.user.email === toEmail) {
  //   throw new Error('Não pode transferir para si mesmo')
  // }

  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado' }
  }

  if (amount <= 0) {
    return { success: false, message: 'Valor da transferência deve ser positivo' }
  }

  if (session.user.email === toEmail) {
    return { success: false, message: 'Não pode transferir para si mesmo' }
  }

  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const fromUser = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true },
      })

      if (!fromUser) return { success: false, message: 'Remetente não encontrado' }
      if (fromUser.balance < amount) return { success: false, message: 'Saldo insuficiente' }

      const toUser = await tx.user.findUnique({
        where: { email: toEmail },
        select: { id: true },
      })

      if (!toUser) return { success: false, message: 'Destinatário não encontrado' }

      await tx.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: amount } },
      })

      await tx.user.update({
        where: { id: toUser.id },
        data: { balance: { increment: amount } },
      })

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: 'TRANSFER',
          fromUserId: session.user.id,
          toUserId: toUser.id,
        },
      })

      revalidatePath('/dashboard')

      return {
        success: true,
        newBalance: fromUser.balance - amount,
        transactionId: transaction.id,
      }
    })
  } catch (err) {
    console.error('Erro inesperado em transfer():', err)
    return { success: false, message: 'Erro interno ao processar transferência' }
  }
}