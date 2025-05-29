import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'react-hot-toast'
import { deposit } from '@/app/dashboard/actions/deposit'
import { DepositForm } from '@/app/dashboard/components/DepositForm'

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
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockDeposit.mockReset()
    ;(toast.success as jest.Mock).mockClear()
    ;(toast.error as jest.Mock).mockClear()
  })

  it('chama deposit e mostra toast de sucesso', async () => {
    mockDeposit.mockResolvedValueOnce(100)

    render(<DepositForm />)

    const input = screen.getByPlaceholderText("Valor (R$)")
    const button = screen.getByRole('button', { name: /depositar/i })

    fireEvent.change(input, { target: { value: '10.50' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockDeposit).toHaveBeenCalledWith(10.5)
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching('Depósito realizado com sucesso!')
      )
    })

  })

  it('mostra mensagem de erro se tentar depositar sem valor', async () => {
    render(<DepositForm />)
  
    const button = screen.getByRole('button', { name: /depositar/i })
  
    fireEvent.click(button) 
  
    await waitFor(() => {
      expect(screen.getByText('Valor inválido')).toBeInTheDocument()
    })
  })
})
