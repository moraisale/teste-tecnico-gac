import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import LoginPage from '@/app/login/page'

// Mocks para simular navigation e Auth
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

describe('LoginPage', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it('renderiza input de login e senha e botão de login', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText(/cadastre-se/i)).toBeInTheDocument()
  })

  it('mostra erro de validação caso os inputs estejam vazios', async () => {
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Email é obrigatório'))
      ).toBeInTheDocument()

      expect(
        screen.getByText((content) => content.includes('Senha deve ter no mínimo 6 caracteres'))
      ).toBeInTheDocument()
    })
  })


  it('redireciona para dashboard quando faz login com sucesso', async () => {
    ;(signIn as jest.Mock).mockResolvedValue({ ok: true, error: null })

    render(<LoginPage />)

    fireEvent.input(screen.getByLabelText(/e-mail/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.input(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: '123456',
        redirect: false,
      })
      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('mostra erro de credenciais incorretas', async () => {
    ;(signIn as jest.Mock).mockResolvedValue({
      error: 'CredentialsSignin',
    })

    render(<LoginPage />)

    fireEvent.input(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.input(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/email ou senha incorretos/i)
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })
})
