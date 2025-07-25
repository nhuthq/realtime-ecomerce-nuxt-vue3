import { PrismaClient } from '@prisma/client'
import { USER_EMAIL_TYPE } from './modules/user-constant';
import { createError, defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    
    const { email, otpCode } = await readBody(event)

    if (!email || !otpCode) {
        throw createError({ statusCode: 400, message: 'Email and OTP code are required'})
    }

    const userExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    console.log('USER EXIST: ', userExist)

    if (userExist) {
        const existingOtpCode=userExist?.otpCode
        if (existingOtpCode && parseInt(existingOtpCode) === parseInt(otpCode)) {
            const updatedUser = await prisma.user.update({
                where: {
                  email: email, 
                },
                data: {
                    isEmailVerified:USER_EMAIL_TYPE.VALID_EMAIL, 
                },
              });
            
              return { 
                statusCode: 200, 
                message: 'Your email has been verified successfully!', 
                user: updatedUser,
                redirect: true 
            };
        } else {
            throw createError({ statusCode: 401, message: 'Invalid credentials or OTP code'})   
        }
    } else {
        throw createError({ statusCode: 401, message: 'Invalid credentials or OTP code'})   
    }
})