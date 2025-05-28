import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RevertButton } from '@/app/dashboard/components/RevertButton'
import { revertTransaction } from '@/app/dashboard/actions/revert'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

jest.mock('@/app/dashboard/actions/revert', () => ({
  revertTransaction: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('RevertButton', () => {
  const mockRouterRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ refresh: mockRouterRefresh })
  })

  it('renderiza o botão "Estornar"', () => {
    render(<RevertButton transactionId="tx-1" />)
    expect(screen.getByText('Estornar')).toBeInTheDocument()
  })

  it('abre e fecha o modal de confirmação', () => {
    render(<RevertButton transactionId="tx-1" />)

    fireEvent.click(screen.getByText('Estornar'))
    expect(screen.getByText('Confirmar estorno?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByText('Confirmar estorno?')).not.toBeInTheDocument()
  })

  it('chama revertTransaction e exibe toast de sucesso', async () => {
    (revertTransaction as jest.Mock).mockResolvedValue(undefined)

    render(<RevertButton transactionId="tx-1" />)
    fireEvent.click(screen.getByText('Estornar'))
    fireEvent.click(screen.getByText('Confirmar'))

    await waitFor(() => {
      expect(revertTransaction).toHaveBeenCalledWith('tx-1')
      expect(toast.success).toHaveBeenCalledWith('Transação estornada com sucesso!')
      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })

  it('exibe mensagem de erro caso revertTransaction falhe', async () => {
    (revertTransaction as jest.Mock).mockRejectedValue(new Error('Falha ao estornar'))

    render(<RevertButton transactionId="tx-1" />)
    fireEvent.click(screen.getByText('Estornar'))
    fireEvent.click(screen.getByText('Confirmar'))

    await waitFor(() => {
      expect(revertTransaction).toHaveBeenCalledWith('tx-1')
      expect(toast.error).toHaveBeenCalledWith('Falha ao estornar')
    })
  })

  it('exibe toast avisando que o destinatário não foi encontrado', async () => {
    (revertTransaction as jest.Mock).mockRejectedValue(
      new Error('Destinatário não encontrado')
    )

    render(<RevertButton transactionId="tx-1" />)
    fireEvent.click(screen.getByText('Estornar'))
    fireEvent.click(screen.getByText('Confirmar'))

    await waitFor(() => {
      expect(revertTransaction).toHaveBeenCalledWith('tx-1')
      expect(toast.error).toHaveBeenCalledWith('Destinatário não encontrado')
    })
  })

})
