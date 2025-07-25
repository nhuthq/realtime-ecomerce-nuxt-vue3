
import { PrismaClient } from '@prisma/client'
import { signInSchema, signUpSchema } from './modules/validate-user'
import { generateOTPCode } from './modules/generate-opt-code';
import { createError, defineEventHandler, readBody } from 'h3';
import { comparePassword, hashPassword } from './modules/brypt';
import { USER_EMAIL_TYPE, USER_ROLE } from './modules/user-constant';
import { sendVerificationEmail } from './modules/send-email-verification';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    
    const body = await readBody(event)
    const { name, email, password } = body
    const result = signUpSchema.safeParse({ name, email, password })
    
    if (!result.success) {
        const errorMessage = `Validation Failed: ${result.error.issues[0].message}`
        throw createError({
            statusCode: 400,
            message: errorMessage,
            data: result.error.flatten,
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
        message: 'User created successfully!', 
        user,
        redirect: true 
    };
})