import { PrismaClient } from '@prisma/client'
import { createError, defineEventHandler, readBody } from 'h3';
import { USER_EMAIL_TYPE, USER_ROLE } from './modules/user-constant';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    
    const { email, otpCode } = await readBody(event)

    const userExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

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
                statusMessage: 'Your email has been verified successfully', 
                redirect: true 
            };
        } else {
            throw createError({ statusCode: 401, message: 'Invalid credentials or OTP code'})   
        }
    } else {
        throw createError({ statusCode: 401, message: 'Invalid credentials or OTP code'})   
    }
})