import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { mainClient } from '@/utils/client'
import { toast } from 'react-hot-toast'
import RegisterPage from '@/app/register/page'

// Mocks para simular chamadas 
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/utils/client', () => ({
  mainClient: {
    post: jest.fn(),
  },
}))

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('RegisterPage', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it('renderiza input de nome/email/senha/confirmar senha e botão de registrar', () => {
    render(<RegisterPage />)

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument()
    expect(screen.getByText(/já possui uma conta/i)).toBeInTheDocument()
  })

  // Verifica se permite fazer login com inputs vazios
  it('shows validation errors if inputs are invalid', async () => {
    render(<RegisterPage />)

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/nome deve ter no mínimo 3 caracteres/i)).toBeInTheDocument()
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument()
    })
  })

  it('mostra erro de validação caso os inputs estejam vazios', async () => {
    render(<RegisterPage />)

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: 'Test User' } })
    fireEvent.input(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'test@example.com' } })
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: 'Abc123' } })
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: 'Abc321' } })

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument()
    })
  })

  it('redireciona para login quando registra um novo user sucesso', async () => {
    ;(mainClient.post as jest.Mock).mockResolvedValueOnce({ data: {} })

    render(<RegisterPage />)

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: 'Test User' } })
    fireEvent.input(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'test@example.com' } })
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: 'Abc123' } })
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: 'Abc123' } })

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
        expect(mainClient.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/register',
        {
            name: 'Test User',
            email: 'test@example.com',
            password: 'Abc123',
        }
      )
      expect(toast.success).toHaveBeenCalledWith('Cadastro realizado com sucesso!')
      expect(pushMock).toHaveBeenCalledWith('/login')
    })
  })

  it('exibe toast com erro', async () => {
    ;(mainClient.post as jest.Mock).mockRejectedValueOnce({
      message: 'Erro no servidor',
    })

    render(<RegisterPage />)

    fireEvent.input(screen.getByLabelText(/nome completo/i), { target: { value: 'Test User' } })
    fireEvent.input(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'test@example.com' } })
    fireEvent.input(screen.getByLabelText(/^senha$/i), { target: { value: 'Abc123' } })
    fireEvent.input(screen.getByLabelText(/confirmar senha/i), { target: { value: 'Abc123' } })

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro no servidor')
    })
  })
})
