import { createError, readBody } from 'h3';
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../../../../utils/with-auth';
import { categorySchema } from './modules/validate-category';

const prisma = new PrismaClient()

export default withAuth(async (event) => {

    const body = await readBody(event);
    const { id, name } = body;

    const results = categorySchema.safeParse({ id, name })

    if (!results.success) {
        throw createError({
            statusCode: 400,
            message: 'Validation Failed'
        })
    }
    try {
        const data = await prisma.category.update({
            where:{
                id:id
            },
            data: {
                name:name,    
            }
        })

        return { 
            statusCode: 200, 
            message: 'Category updated successfully!', 
            data
        };
    } catch(error) {
        const errorMessage = 'Somethings went wrong. Please try again!'
        throw createError({
            statusCode: 500,
            message: errorMessage
        })
    }
})