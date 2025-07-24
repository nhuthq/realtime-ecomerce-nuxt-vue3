
import { PrismaClient } from '@prisma/client'
import { signInSchema } from './modules/validate-user'
import { generateOTPCode } from './modules/generate-opt-code';
import { createError, defineEventHandler, readBody } from 'h3';
import { comparePassword, hashPassword } from './modules/brypt';
import { USER_EMAIL_TYPE, USER_ROLE } from './modules/user-constant';
import { sendVerificationEmail } from './modules/send-email-verification';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    
    const body = await readBody(event)
    const { name, email, password } = body
    const result = signInSchema.safeParse({ name, email, password })

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Failed',
            data: result.error.flatten(),
        })
    }

    const userExist = await prisma.user.findUnique({
        where: { email }
    })

    if (userExist) {
        throw createError({ statusCode: 400, message: 'This email is already been taken' })
    }

    const otpCode = generateOTPCode()
    const hashPwd = await hashPassword(password)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            otpCode,
            password: hashPwd,
            role: USER_ROLE.CUSTOMER,
            isEmailVerified: USER_EMAIL_TYPE.INVALID_EMAIL,
        }
    })

    await sendVerificationEmail(email, otpCode)

    return { 
        statusCode: 200, 
        statusMessage: 'User Created successfully', 
        user, 
        redirect: true 
    };
})