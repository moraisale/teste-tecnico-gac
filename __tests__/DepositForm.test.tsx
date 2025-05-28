import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-hot-toast'
import { deposit } from '@/app/dashboard/actions/deposit'
import DepositForm from '@/app/dashboard/components/DepositForm'

jest.mock('@/app/dashboard/actions/deposit', () => ({
  deposit: jest.fn(),
}))

const refresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('DepositForm', () => {
  const mockDeposit = deposit as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('chama deposit e mostra toast de sucesso', async () => {
    mockDeposit.mockResolvedValueOnce(undefined)

    render(<DepositForm />)

    const input = screen.getByPlaceholderText('Valor (R$)')
    const button = screen.getByRole('button', { name: /depositar/i })

    fireEvent.change(input, { target: { value: '10' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockDeposit).toHaveBeenCalledWith(10)
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(/Depósito de R\$ ?10[,\.]00/)
      )
      expect(refresh).toHaveBeenCalled()
    })
  })

  it('mostra mensagem de erro em caso de falha', async () => {
    mockDeposit.mockRejectedValueOnce(new Error('Erro de rede'))

    render(<DepositForm />)

    const input = screen.getByPlaceholderText('Valor (R$)')
    const button = screen.getByRole('button', { name: /depositar/i })

    fireEvent.change(input, { target: { value: '100' } })
    fireEvent.click(button)

    await waitFor(() => {
        expect(screen.queryByText((text) =>
            text.includes('Valor inválido')
        )).toBeInTheDocument()
    })
  })
})
