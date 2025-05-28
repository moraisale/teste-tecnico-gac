import { deposit } from '@/app/dashboard/actions/deposit'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}))

jest.mock('next-auth')

const mockTx = {
  user: {
    update: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
  },
}

describe('deposit (Server Action)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  console.log('Jest config loaded')
  it('deve realizar um depósito com sucesso', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })

    mockTx.user.update.mockResolvedValueOnce({ balance: 150 })
    mockTx.transaction.create.mockResolvedValueOnce({})
    ;(prisma.$transaction as jest.Mock).mockImplementation(async (fn: any) => {
      return fn(mockTx)
    })

    const balance = await deposit(50)

    expect(prisma.$transaction).toHaveBeenCalled()
    expect(mockTx.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { balance: { increment: 50 } },
      select: { balance: true },
    })
    expect(mockTx.transaction.create).toHaveBeenCalledWith({
      data: {
        amount: 50,
        type: 'DEPOSIT',
        toUserId: 'user-123',
      },
    })
    expect(balance).toBe(150)
  })

  it('deve lançar erro se o usuário não estiver autenticado', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    await expect(deposit(50)).rejects.toThrow('Não autorizado')
  })

  it('deve lançar erro se o valor for inválido', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })

    await expect(deposit(0)).rejects.toThrow('O valor do depósito deve ser positivo')
    await expect(deposit(-10)).rejects.toThrow('O valor do depósito deve ser positivo')
  })

  it('deve propagar erro do banco de dados', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' },
    })

    ;(prisma.$transaction as jest.Mock).mockImplementation(async () => {
      throw new Error('Erro do banco')
    })

    await expect(deposit(100)).rejects.toThrow('Erro do banco')
  })
})
