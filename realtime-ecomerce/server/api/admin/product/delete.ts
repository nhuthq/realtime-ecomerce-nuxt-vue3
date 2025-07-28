import { createError, readBody } from "h3";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "../../../../utils/with-auth";
import { deleteProductSchema } from "./modules/validate-product";

const prisma = new PrismaClient();

export default withAuth(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  const results = deleteProductSchema.safeParse({ id });

  if (!results.success) {
    throw createError({
      statusCode: 400,
      message: "Validation Failed",
    });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: "Product deleted successfully!",
    };
  } catch (error) {
    console.error("ERROR: ", error);
    throw createError({
      statusCode: 500,
      message: "Something went wrong! Please try again.",
    });
  }
});
