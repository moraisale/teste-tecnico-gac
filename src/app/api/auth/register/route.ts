import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import toast from 'react-hot-toast'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        balance: 0,
      },
    })

    return NextResponse.json(
      { 
        message: 'Usuário criado com sucesso',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro no servidor' },
      { status: 500 }
    )
  }
}