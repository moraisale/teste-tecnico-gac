// src/app/dashboard/deposit/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { deposit } from '../actions/deposit'

const depositSchema = z.object({
  amount: z.number()
    .min(0.01, 'Valor mínimo: R$0.01')
    .max(10000, 'Valor máximo: R$10.000')
})

export default function DepositForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(depositSchema),
    defaultValues: { amount: 0 }
  })

  const onSubmit = async (values: { amount: number }) => {
    try {
      const newBalance = await deposit(values.amount)
      toast.success(`Depósito de R$${values.amount.toFixed(2)} realizado! Novo saldo: R$${newBalance?.toFixed(2)}`)
      form.reset()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar depósito')
    }
  }

 return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-100 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Depósito</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            {...form.register("amount", {
              setValueAs: (value) => parseFloat(value) || 0, 
            })}
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-[#004B88] focus:border-[#004B88]"
          />
        </div>

        {form.formState.errors.amount && (
          <div className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md">
            {form.formState.errors.amount.message}
          </div>
        )}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-[#5BC4BE] hover:bg-[#4AB3AD] text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-70 cursor-pointer"
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center justify-center">
              Processando...
            </span>
          ) : 'Depositar'}
        </button>
      </form>
    </div>
  )
}