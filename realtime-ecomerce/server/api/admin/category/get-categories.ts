import { PrismaClient } from '@prisma/client'
import { createError, defineEventHandler } from 'h3';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {

    try {
        const categories = await prisma.category.findMany()

        return { 
            statusCode: 200, 
            message: 'Category get successfully!', 
            categories
        };
    } catch(error) {
        const errorMessage = 'Somethings went wrong. Please try again!'
        throw createError({
            statusCode: 500,
            message: errorMessage
        })
    }
})