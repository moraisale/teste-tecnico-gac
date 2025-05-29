import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export const BalanceCard = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  const balance = user.balance
  const isNegative = balance < 0
  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(balance)

  return (
    <div className="p-6 text-white border-0 shadow-lg bg-[#002948] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Saldo Atual</h3>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isNegative
              ? "bg-red-500/20 text-red-100 border border-red-400/30"
              : "bg-green-500/20 text-green-100 border border-green-400/30"
          }`}
        >
          {isNegative ? "Negativo" : "Positivo"}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-blue-100 text-sm mb-1">Saldo disponível</p>
          <p className={`text-3xl font-bold ${isNegative ? "text-red-200" : "text-white"}`}>{formattedBalance}</p>
        </div>

        {isNegative && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-100 mb-1">Atenção</h4>
                <p className="text-sm text-red-200">
                  Seu saldo está negativo. Deposite valores para regularizar sua conta.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
