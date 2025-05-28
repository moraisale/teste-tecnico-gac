import { render, screen } from '@testing-library/react'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import TransactionList from '@/app/dashboard/components/TransactionsList'

jest.mock('next-auth')
jest.mock('@/lib/prisma')

describe('TransactionList', () => {
  const mockSession = {
    user: {
      id: 'user-123',
      name: 'Fulano',
      email: 'fulano@email.com',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
  })

  it('exibe mensagem se não houver transações', async () => {
    ;(prisma.transaction.findMany as jest.Mock).mockResolvedValue([])

    render(<TransactionList />)

    const noTransactionsMsg = await screen.findByText('Nenhuma transação encontrada')
    expect(noTransactionsMsg).toBeInTheDocument()
  })

  it('exibe lista de transações corretamente', async () => {
    ;(prisma.transaction.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'tx-1',
        type: 'DEPOSIT',
        amount: 100,
        createdAt: new Date('2024-01-01T10:00:00'),
        reversed: false,
        fromUserId: null,
        toUserId: 'user-123',
        fromUser: null,
        toUser: { name: 'Fulano', email: 'fulano@email.com' },
      },
      {
        id: 'tx-2',
        type: 'TRANSFER',
        amount: 200,
        createdAt: new Date('2024-01-02T11:00:00'),
        reversed: false,
        fromUserId: 'user-123',
        toUserId: 'user-456',
        fromUser: { name: 'Fulano', email: 'fulano@email.com' },
        toUser: { name: 'Ciclano', email: 'ciclano@email.com' },
      },
    ])

    render(<TransactionList />)

    expect(await screen.findByText('Depósito')).toBeInTheDocument()
    expect(screen.getByText('+R$ 100,00')).toBeInTheDocument()

    expect(screen.getByText('Transferência para Ciclano')).toBeInTheDocument()
    expect(screen.getByText('-R$ 200,00')).toBeInTheDocument()
  })

  it('retorna null se o usuário não estiver logado', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const { container } = render(<TransactionList />)

    expect(container.innerHTML).toBe('')
  })
})
