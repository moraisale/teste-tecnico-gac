'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { transfer } from '../actions/transfer'
import { FiMail, FiDollarSign } from 'react-icons/fi'

const transferSchema = z.object({
  toEmail: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  amount: z
    .number({ invalid_type_error: 'Valor inválido' })
    .min(0.01, 'Valor mínimo: R$0.01')
    .max(10000, 'Valor máximo: R$10.000'),
})

type TransferFormData = z.infer<typeof transferSchema>

export const TransferForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: { toEmail: '', amount: undefined },
  })

    const onSubmit = async (values: TransferFormData) => {
      const result = await transfer(values.toEmail, values.amount)

      if (!result.success) {
        toast.error(result.message ?? 'Erro desconhecido')
        return
      }

      toast.success(
        `Transferência realizada com sucesso!`
      )
      reset()
      router.refresh()
    }

  return (
    <div className="w-full max-w-full bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-[#002948] mb-6">Transferência</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="relative">
          <FiMail className="absolute left-3 top-3.5 text-[#002948]" size={20} />
          <input
            id="email"
            type="email"
            {...register('toEmail')}
            placeholder="E-mail do destinatário"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-[#002948] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F2C363]"
          />
          {errors.toEmail && (
            <p className="text-sm text-red-600 mt-1">{errors.toEmail.message}</p>
          )}
        </div>

        <div className="relative">
          <FiDollarSign className="absolute left-3 top-3.5 text-[#002948]" size={20} />
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            {...register('amount', {
              setValueAs: (v) => parseFloat(v),
            })}
            placeholder="Valor (R$)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-[#002948] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F2C363]"
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
        )}  

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg cursor-pointer text-white font-semibold bg-[#002948] hover:bg-[#001d35] transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processando...
            </span>
          ) : (
            'Transferir'
          )}
        </button>
      </form>
    </div>
  )
}
