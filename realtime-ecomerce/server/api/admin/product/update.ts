import { createError, readBody } from "h3";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "../../../../utils/with-auth";
import { productScheme } from "./modules/validate-product";

const prisma = new PrismaClient();

export default withAuth(async (event) => {
  const body = await readBody(event);
  const { id, name, color, price, categoryId } = body;

  const results = productScheme.safeParse({
    id,
    name,
    color,
    price,
    categoryId,
  });

  if (!results.success) {
    throw createError({
      statusCode: 400,
      message: "Validation Failed",
    });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name,
        color: color,
        price: price.toString(),
        categoryId: categoryId,
      },
    });

    return {
      statusCode: 200,
      message: "Product created successfully!",
      product,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Something went wrong! Please try again.",
    });
  }
});
