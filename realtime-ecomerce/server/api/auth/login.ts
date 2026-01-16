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
        const errorMessage = `Validation Failed: ${result.error.issues[0].message}`
        throw createError({
            statusCode: 400,
            statusMessage: errorMessage,
            data: result.error.flatten(),
        })
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw createError({ statusCode: 401, message: 'Email is not registered, Please try again!' })
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
        return { 
            statusCode: 200, 
            message: 'User logged successfully!', 
            data,
            redirect: true 
        };
    } else {
        throw createError({ statusCode: 401, message: 'Password is invalid, Please try again!' })
    }
})