import { signAccessToken, signRefreshToken } from './../../../utils/generate-jwt-token';

import { PrismaClient } from '@prisma/client'
import { comparePassword } from './modules/brypt'
import { signInSchema } from './modules/validate-user'
import { createError, defineEventHandler, readBody } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    
    const body = await readBody(event)
    const { email, password } = body
    const result = signInSchema.safeParse({ email, password })

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Failed',
            data: result.error.flatten(),
        })
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (isPasswordValid) {
        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken(user?.id),
            signRefreshToken(user?.id)
        ])
        const data = {
            token: {
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            user: { 
                id              : user?.id,
                name            : user?.name, 
                email           : user?.email, 
                role            : user?.role, 
                isEmailVerified : user?.isEmailVerified,
                createdAt       : user?.createdAt.toISOString(),
                updatedAt       : user?.updatedAt.toISOString()
            },
            isLoggedIn: true
        }
        return { message: 'User logged successfully', data };
    } else {
        throw createError({ statusCode: 422, message: 'Email or Password invalid' })
    }
})