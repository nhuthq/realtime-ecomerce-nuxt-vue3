import { createError, readBody } from 'h3';
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../../../../utils/with-auth';
import { categorySchema } from './modules/validate-category';

const prisma = new PrismaClient()

export default withAuth(async (event) => {

    const body = await readBody(event);
    const { id, name } = body;

    const results = categorySchema.safeParse({ id, name })

    console.log("results", results)

    if (!results.success) {
        throw createError({
            statusCode: 400,
            message: 'Validation Failed'
        })
    }
    const categoryExist = await prisma.category.findUnique({
        where:{
            name: name
        },
    })

    
    if (categoryExist) {
        console.log("categoryExist", categoryExist)
        throw createError({ statusCode: 400, message: 'This category is already exists' })
        
    } else {
        const category = await prisma.category.create({
            data: {
                name:name,
            }
        })
        return { 
            statusCode: 200, 
            message: 'Category created successfully!', 
        };
    }
})