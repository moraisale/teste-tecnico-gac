import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TransferForm from '@/app/dashboard/components/TransferForm'
import { toast } from 'react-hot-toast'
import { transfer as mockTransfer } from '@/app/dashboard/actions/transfer'
import { useRouter } from 'next/navigation'

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/app/dashboard/actions/transfer', () => ({
  transfer: jest.fn(),
}))

describe('TransferForm', () => {
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh })
  })

  it('envia o formulário com sucesso e mostra toast', async () => {
    ;(mockTransfer as jest.Mock).mockResolvedValueOnce(undefined)

    render(<TransferForm />)

    const emailInput = screen.getByPlaceholderText('E-mail do destinatário')
    const amountInput = screen.getByPlaceholderText('Valor (R$)')
    const button = screen.getByRole('button', { name: /transferir/i })

    fireEvent.change(emailInput, { target: { value: 'destinatario@email.com' } })
    fireEvent.change(amountInput, { target: { value: '50' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockTransfer).toHaveBeenCalledWith('destinatario@email.com', 50)
      expect(toast.success).toHaveBeenCalledWith('Transferência de R$50.00 realizada com sucesso!')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('mostra toast de erro se transferência falhar', async () => {
    ;(mockTransfer as jest.Mock).mockRejectedValueOnce(new Error('Erro de servidor'))

    render(<TransferForm />)

    fireEvent.change(screen.getByPlaceholderText('E-mail do destinatário'), {
      target: { value: 'teste@falha.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), {
      target: { value: '30' },
    })

    fireEvent.click(screen.getByRole('button', { name: /transferir/i }))

    await waitFor(() => {
      expect(mockTransfer).toHaveBeenCalledWith('teste@falha.com', 30)
      expect(toast.error).toHaveBeenCalledWith('Erro de servidor')
    })
  })

  it('exibe mensagens de validação e não envia com dados inválidos', async () => {
    render(<TransferForm />)

    fireEvent.click(screen.getByRole('button', { name: /transferir/i }))

    await waitFor(() => {
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument()
    })

    expect(mockTransfer).not.toHaveBeenCalled()
  })
})
