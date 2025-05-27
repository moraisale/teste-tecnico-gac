'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function transfer(toEmail: string, amount: number) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Não autorizado')
  }

  if (amount <= 0) {
    throw new Error('Valor da transferência deve ser positivo')
  }

  if (session.user.email === toEmail) {
    throw new Error('Não pode transferir para si mesmo')
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Verifica saldo do remetente
    const fromUser = await tx.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true }
    })

    if (!fromUser) throw new Error('Remetente não encontrado')
    if (fromUser.balance < amount) throw new Error('Saldo insuficiente')

    // 2. Encontra destinatário
    const toUser = await tx.user.findUnique({
      where: { email: toEmail },
      select: { id: true }
    })

    if (!toUser) throw new Error('Destinatário não encontrado')

    // 3. Atualiza saldos
    await tx.user.update({
      where: { id: session.user.id },
      data: { balance: { decrement: amount } },
    })

    await tx.user.update({
      where: { id: toUser.id },
      data: { balance: { increment: amount } },
    })

    // 4. Registra transação
    const transaction = await tx.transaction.create({
      data: {
        amount,
        type: 'TRANSFER',
        fromUserId: session.user.id,
        toUserId: toUser.id,
      }
    })

    // Atualiza a página
    revalidatePath('/dashboard')

    return {
      success: true,
      newBalance: fromUser.balance - amount,
      transactionId: transaction.id
    }
  })
}