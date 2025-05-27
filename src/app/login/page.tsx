'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log(data)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })


      if (result?.error) {
        // Erros específicos do NextAuth
        if (result.error === 'CredentialsSignin') {
          setError('password', {
            type: 'manual',
            message: 'Email ou senha incorretos'
          })
        } else {
          toast.error(result.error)
        }
        return
      }

      // Login bem-sucedido
      router.push('/')
    } catch (error) {
      toast.error('Ocorreu um erro inesperado')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 px-4 md:px-0">
        <div className="text-center">
          <img className="mx-auto h-16 w-auto" src="/logo-grupo.jpg" alt="Logo" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Faça login na sua conta
          </h2>
        </div>

        {errors.password && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.password.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário de login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                {...register('email')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm text-black"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                {...register('password')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm text-black"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#004B88] focus:ring-[#004B88] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar de mim
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-[#004B88] hover:text-[#004B88]">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#004B88] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Entrar'}
            </button>
          </div>
        </form>

        {/* Opcional: Login com Google */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-medium text-[#004B88] cursor-pointer hover:text-[#004B88]/80">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}