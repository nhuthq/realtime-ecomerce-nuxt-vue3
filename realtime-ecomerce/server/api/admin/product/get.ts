import { getQuery } from 'h3'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../../../../utils/with-auth'

const prisma = new PrismaClient()

export default withAuth(async (event) => {

    const query = getQuery(event)
    const searchString = query?.search as string
    const page = parseInt(query?.page as string) || 1
    const limit = parseInt(query?.limit as string) || 10

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: searchString ? {
                name: {
                    contains: searchString,
                    mode: 'insensitive'
                }
            } : {},
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true,
                images: true
            },
            // 2-1*limit=skip=10
            skip: (page - 1) * limit,
            take: limit
        }),
        prisma.product.count({ 
            where: searchString ? {
                name: {
                    contains: searchString,
                    mode: 'insensitive'
                }
            } : {}
        })
    ])

    return {
        statusCode: 200,
        message: 'Products fetched successfully!',
        products, 
        metadata: {
            total, 
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
})