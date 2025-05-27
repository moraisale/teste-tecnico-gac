'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function deposit(amount: number) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error('Não autorizado')
  }

  if (amount <= 0) {
    throw new Error('O valor do depósito deve ser positivo')
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Atualiza saldo
      const user = await tx.user.update({
        where: { id: session.user.id },
        data: { balance: { increment: amount } },
        select: { balance: true }
      })

      // Registra transação
      await tx.transaction.create({
        data: {
          amount,
          type: 'DEPOSIT',
          toUserId: session.user.id,
        }
      })

      return user.balance
    })
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao processar depósito')
  }
}